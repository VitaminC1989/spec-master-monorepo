import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenAPI() {
  console.log('🚀 Starting OpenAPI generation...');

  // Create NestJS application without listening
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('SpecMaster API')
    .setDescription('服装配方管理系统后端 API')
    .setVersion('1.0.0')
    .addTag('styles', '款号管理')
    .addTag('variants', '颜色版本管理')
    .addTag('bom-items', '配料明细管理')
    .addTag('spec-details', '规格明细管理')
    .addTag('customers', '客户管理')
    .addTag('sizes', '尺码管理')
    .addTag('units', '单位管理')
    .build();

  // Generate OpenAPI document
  const document = SwaggerModule.createDocument(app, config);

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../../../packages/api-contract');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to packages/api-contract/openapi.json
  const outputPath = path.join(outputDir, 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  const pathCount = document.paths ? Object.keys(document.paths).length : 0;
  console.log('✅ OpenAPI spec generated successfully at: ' + outputPath);
  console.log('📊 Total endpoints: ' + pathCount);

  await app.close();
  process.exit(0);
}

generateOpenAPI().catch((error) => {
  console.error('❌ Failed to generate OpenAPI spec:', error);
  process.exit(1);
});
