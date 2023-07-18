import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { PushService } from './push.service';
import {
  SendPushDto,
  TokenDto,
  TokenQueryDto,
  TopicDto,
  TopicQueryDto,
} from './push-token.dto';
import { Config, Token, Topic } from './token.interface';
import { AppOptions } from 'firebase-admin';

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

  @Delete('/topic/:id')
  removeTopic(@Param() params: any) {
    return this.pushService.removeTopic(params.id);
  }

  @Delete('/token/:id')
  removeToken(@Param() params: any) {
    return this.pushService.removeToken(params.id);
  }

  @Delete('/config/:id')
  removeConfig(@Param() params: any) {
    return this.pushService.removeConfig(params.id);
  }

  @Get('/token')
  getToken(@Query() currQuery: TokenQueryDto): Token[] {
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

  @Post('/config')
  setConfig(@Body() currBody: AppOptions): Config {
    return this.pushService.setConfig(currBody);
  }

  @Get('/config')
  getConfig(): Config[] {
    return this.pushService.getConfig();
  }

  @Post('/token/push')
  sendPushByToken(@Body() body: SendPushDto) {
    return this.pushService.sendPushToken(
      body.tokenId,
      body.body,
      body.configId,
    );
  }
}
