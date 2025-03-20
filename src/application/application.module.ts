import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'nest-casl';
import { ApplicationsController } from 'src/applications/applications.controller';
import { ApplicationsService } from 'src/applications/applications.service';
import { Application } from 'src/applications/entities/application.entity';
import { permissions } from 'src/auth/permissions';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    CaslModule.forFeature({ permissions }), // Add your entities here
  ],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationModule {}
