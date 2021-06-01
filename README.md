<div align="center">
  <h1>Nestjs Dto Injector</h1>
</div>

Inject any value directly into dto classes using decorators.

## Index
1. [Install](#Install)
2. [Injecting Values](#Injecting-Values)
3. [Nested Objects](#Nested-Objects)

## Install

```shell
npm i nestjs-dto-injector

yarn add nestjs-dto-injector
```

## Injecting Values


```typescript
// test.injector.ts

import { Injectable } from '@nestjs/common';
import { Injector } from 'nestjs-dto-injector';

@Injectable()
export class TestInjector implements Injector<string> {
    async apply(dto: any): Promise<string> {
        return 'new value';
    }
}
```

```typescript
// test.dto.ts

import { TestInjector } from './test.injector';
import { ApplyInjection } from 'nestjs-dto-injector';

export class TestDto {
    @ApplyInjection(TestInjector)
    value: string;
}
```

```typescript
// test.controller.ts

import { TestDto } from './test.dto';
import { ApplyInjectionPipe } from 'nestjs-dto-injector';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';


@Controller()
export class TestController {
    @Post()
    @UsePipes(ApplyInjectionPipe)
    async post(@Body() dto: TestDto) {
        console.log(dto.value); // new value
    }
}
```

```typescript
// test.module.ts

import { TestInjector } from 'test.injector';
import { TestController } from './test.controller';

@Module({
  controllers: [TestController],
  providers: [TestInjector],
})
export class TestModule {}
```

## Nested Objects

```typescript
// test.dto.ts

import { TestInjector } from './test.injector';
import { ApplyInjection } from 'nestjs-dto-injector';

export class TestDto {
    @ApplyInjection(TestInjector)
    value: string;
}
```

```typescript
// test-nested.dto.ts

import { TestDto } from 'test.dto';
import { ApplyInjectionNested } from 'nestjs-dto-injector';

export class TestNestedDto {
    @ApplyInjectionNested()
    testDto: TestDto;
}
```