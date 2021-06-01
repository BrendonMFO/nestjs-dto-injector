import { ModuleRef } from '@nestjs/core';
import { Injector } from '../interfaces/injector.interface';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { APPLY_INJECTOR_KEY } from '../decorators/apply-injection.decorator';
import { InjectorMetadata } from '../interfaces/injector-metadata.interface';
import { APPLY_INJECTOR_NESTED_KEY } from '../decorators/apply-injection-nested.decorator';

@Injectable()
export class ApplyInjectionPipe implements PipeTransform {
  constructor(private readonly moduleRef: ModuleRef) {}

  async transform<T>(value: T, metadata: ArgumentMetadata): Promise<T> {
    if (!value || metadata.type === 'custom') {
      return value;
    }
    const instance = plainToClass(metadata.metatype as ClassConstructor<any>, value);
    await this.verifyInjectMetadata(instance);

    return instance as T;
  }

  private async verifyInjectMetadata(instance: any): Promise<void> {
    const metadataKeys: Array<InjectorMetadata<unknown>> = Reflect.getMetadata(
      APPLY_INJECTOR_KEY,
      instance,
    );

    if (metadataKeys?.length) {
      await this.applyInjection(metadataKeys, instance);
    }

    const metadataNestedKeys: Array<{ property: any; type: any }> = Reflect.getMetadata(
      APPLY_INJECTOR_NESTED_KEY,
      instance,
    );

    if (metadataNestedKeys?.length) {
      for (const { property } of metadataNestedKeys) {
        const type = Reflect.getMetadata('design:type', instance, property);
        if (instance[property] == undefined) {
          instance[property] = plainToClass(type, {});
        }

        await this.verifyInjectMetadata(instance[property]);
      }
    }
  }

  private async applyInjection(
    metadataKeys: InjectorMetadata<unknown>[],
    value: any,
  ): Promise<void> {
    for (const metadataKey of metadataKeys) {
      const injectorInstance: Injector<unknown> = await this.moduleRef.create(
        metadataKey.injectorType,
      );
      const result = await injectorInstance.apply(value);
      value[metadataKey.property] = result;
    }
  }
}
