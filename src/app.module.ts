import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Users } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ShowsModule } from './shows/shows.module';
import { Shows } from './shows/entities/shows.entity';
import { ShowDate } from './shows/entities/showDate.entity';
import { Artists } from './shows/entities/artists.entity';
import { Seats } from './shows/entities/seats.entity';
import { Prices } from './shows/entities/prices.entity';
import { TicketsModule } from './tickets/tickets.module';
import { Tickets } from './tickets/entities/tickets.entity';
import { Sections } from './shows/entities/sections.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [Users, Shows, ShowDate, Artists, Seats, Prices, Sections, Tickets],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
    AuthModule,
    ShowsModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}