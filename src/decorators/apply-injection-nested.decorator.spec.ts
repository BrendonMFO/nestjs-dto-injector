import {
  ApplyInjectionNested,
  APPLY_INJECTOR_NESTED_KEY,
} from './apply-injection-nested.decorator';

class Test {
  @ApplyInjectionNested()
  @Reflect.metadata('design:type', null)
  property: unknown;
}

class Test2 {
  @ApplyInjectionNested()
  @Reflect.metadata('design:type', null)
  property: unknown;

  @ApplyInjectionNested()
  @Reflect.metadata('design:type', null)
  property2: unknown;
}

describe('ApplyInjectionNestedDecorator', () => {
  it('should apply metadata', () => {
    const instanceTest = new Test();
    const metadatas = Reflect.getMetadata(
      APPLY_INJECTOR_NESTED_KEY,
      instanceTest,
    );
    expect(metadatas).toBeInstanceOf(Array);
    expect(metadatas.length).toBe(1);
    expect(metadatas[0].property).toBe('property');
  });

  it('should apply metadata twice', () => {
    const instanceTest = new Test2();
    const metadatas = Reflect.getMetadata(
      APPLY_INJECTOR_NESTED_KEY,
      instanceTest,
    );
    expect(metadatas).toBeInstanceOf(Array);
    expect(metadatas.length).toBe(2);
    expect(metadatas[0].property).toBe('property');
    expect(metadatas[1].property).toBe('property2');
  });
});
