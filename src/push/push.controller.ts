import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PushService } from './push.service';
import {
  TokenDto,
  TokenQueryDto,
  TopicDto,
  TopicQueryDto,
} from './push-token.dto';
import { Token, Topic } from './token.interface';

@Controller()
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('/token')
  setToken(@Body() currBody: TokenDto): Token {
    return this.pushService.setToken(currBody);
  }

  @Post('/topic')
  setTopic(@Body() currBody: TopicDto): Topic {
    return this.pushService.setTopic(currBody);
  }

  @Get('/token')
  getToken(@Query() currQuery: TokenQueryDto): Token[] {
    console.log('currQuery', currQuery, JSON.stringify(currQuery));
    if (JSON.stringify(currQuery) === '{}') {
      return this.pushService.getToken();
    }
    return this.pushService.getTokenByUsername(currQuery.username);
  }

  @Get('/topic')
  getTopic(@Query() currQuery: TopicQueryDto): Topic[] {
    console.log('currQuery', currQuery, JSON.stringify(currQuery));
    if (JSON.stringify(currQuery) === '{}') {
      return this.pushService.getTopic();
    }
    return this.pushService.getTopicByTitle(currQuery.title);
  }
}
