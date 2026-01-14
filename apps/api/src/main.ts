import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 剔除未定义的属性
      forbidNonWhitelisted: true, // 抛出错误如果有未定义属性
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局响应转换拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS 配置（允许前端访问）
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('SpecMaster API')
    .setDescription('服装配方管理系统后端 API')
    .setVersion('1.0')
    .addTag('Styles', '款号管理')
    .addTag('Variants', '颜色版本管理')
    .addTag('BOM Items', '配料明细管理')
    .addTag('Spec Details', '规格明细管理')
    .addTag('Customers', '客户管理')
    .addTag('Sizes', '尺码管理')
    .addTag('Units', '单位管理')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
