import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ShareModule } from '../share/share.module';
import { PublicSpaceModule } from '../public-space/public-space.module';

@Module({
  imports: [ShareModule, PublicSpaceModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
