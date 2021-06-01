import {
  ApplyInjection,
  InjectorMetadatas,
  APPLY_INJECTOR_KEY,
} from './apply-injection.decorator';
import { Injector } from '../interfaces/injector.interface';

class TestInjector implements Injector<number> {
  async apply(): Promise<number> {
    return 10;
  }
}

class Test {
  @ApplyInjection(TestInjector)
  toInject!: number;
}

describe('ApplyInjectionDecorator', () => {
  it('should apply metadata', async () => {
    const testInstance = new Test();

    expect(Reflect.getMetadataKeys(testInstance).length).toBe(1);

    const [injector]: InjectorMetadatas = Reflect.getMetadata(
      APPLY_INJECTOR_KEY,
      testInstance,
    );
    expect(injector.property).toBe('toInject');
    expect(injector.injectorType).toBe(TestInjector);

    const injectorInstance = new injector.injectorType();
    expect(await injectorInstance.apply()).toBe(10);
  });
});
