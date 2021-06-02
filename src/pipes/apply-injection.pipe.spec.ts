import { Test } from '@nestjs/testing';
import { ArgumentMetadata, Injectable } from '@nestjs/common';
import { ApplyInjectionPipe } from './apply-injection.pipe';
import { Injector } from '../interfaces/injector.interface';
import { ApplyInjection } from '../decorators/apply-injection.decorator';
import { ApplyInjectionNested } from '../decorators/apply-injection-nested.decorator';

@Injectable()
class TestInjector implements Injector<string> {
  async apply(): Promise<string> {
    return 'test';
  }
}

class TestModelWithInjectField {
  @ApplyInjection(TestInjector)
  injectedField!: string;
}

class Test1 {
  @ApplyInjection(TestInjector)
  injectedField1!: string;
}

class Test2 {
  @ApplyInjectionNested()
  @Reflect.metadata('design:type', Test1)
  injectedNestedField2!: Test1;
}

describe('ApplyInjection', () => {
  let applyInjectionPipe: ApplyInjectionPipe;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApplyInjectionPipe, TestInjector],
    }).compile();
    applyInjectionPipe = module.get(ApplyInjectionPipe);
  });

  it('should be empty', async () => {
    const metadata = {} as ArgumentMetadata;
    const result = await applyInjectionPipe.transform(null, metadata);
    expect(result).toStrictEqual(null);
    const result2 = await applyInjectionPipe.transform(undefined, metadata);
    expect(result2).toStrictEqual(undefined);
  });

  it('should be test', async () => {
    const metadata = {
      type: 'body',
      metatype: TestModelWithInjectField,
    } as ArgumentMetadata;

    const result = await applyInjectionPipe.transform<TestModelWithInjectField>(
      {} as TestModelWithInjectField,
      metadata,
    );
    expect(result.injectedField).toBe('test');
  });

  it('should be test', async () => {
    const metadata = {
      type: 'body',
      metatype: Test2,
    } as ArgumentMetadata;
    const result = await applyInjectionPipe.transform<Test2>(
      {} as Test2,
      metadata,
    );
    result.injectedNestedField2.injectedField1;
    expect(result.injectedNestedField2.injectedField1).toBe('test');
  });
});
