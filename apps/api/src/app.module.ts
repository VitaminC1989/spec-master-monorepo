import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './modules/customers/customers.module';
import { StylesModule } from './modules/styles/styles.module';
import { VariantsModule } from './modules/variants/variants.module';
import { BomItemsModule } from './modules/bom-items/bom-items.module';
import { SpecDetailsModule } from './modules/spec-details/spec-details.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { UnitsModule } from './modules/units/units.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CustomersModule,
    StylesModule,
    VariantsModule,
    BomItemsModule,
    SpecDetailsModule,
    SizesModule,
    UnitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
