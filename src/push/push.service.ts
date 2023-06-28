import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TokenDto, TopicDto } from './push-token.dto';
import { Config, Token, Topic } from './token.interface';
import LocalDb from './localDb';
import { fbAdmin } from './fbAdmin';

@Injectable()
export class PushService {
  private readonly tokens = new LocalDb<Token>('tokens');
  private readonly topics = new LocalDb<Topic>('topic');
  private readonly config = new LocalDb<Config>('config');
  setToken(currToken: TokenDto): Token {
    if (this.tokens.doc.find((el) => el.token === currToken.token)) {
      throw new BadRequestException('the token is already there'); //'the token is already there';
    }
    const id = uuidv4();
    const newToken = { ...currToken, id };
    this.tokens.setDoc(newToken);
    return newToken;
  }

  setTopic(currTopic: TopicDto) {
    if (this.topics.doc.find((el) => el.topic === currTopic.topic)) {
      throw new BadRequestException('the topic is already there'); //'the token is already there';
    }
    const id = uuidv4();
    const newTopic = { ...currTopic, id };
    this.topics.setDoc(newTopic);
    return newTopic;
  }

  getTopic(): Topic[] {
    return this.topics.doc;
  }

  getTopicByTitle(title: string): Topic[] {
    return this.topics.doc.filter((el) => el.title.indexOf(title) !== -1);
  }

  getToken(): Token[] {
    return this.tokens.doc;
  }

  getTokenByUsername(username: string): Token[] {
    return this.tokens.doc.filter((el) => el.username.indexOf(username) !== -1);
  }

  setConfig(config: any) {
    return this.config.setDoc(config);
  }

  sendPushTopic(topicId: string, body: any, cofigId?: string) {
    const config: Config = cofigId
      ? this.config.doc.find((el) => el.id === cofigId) || this.config.doc[0]
      : this.config.doc[0];
    const admin = new fbAdmin(config);
    admin.sendTopic(topicId, body);
  }

  sendPushToken(tokenId: string, body: any, cofigId?: string) {
    const config: Config = cofigId
      ? this.config.doc.find((el) => el.id === cofigId) || this.config.doc[0]
      : this.config.doc[0];
    const admin = new fbAdmin(config);
    admin.sendToken(tokenId, body);
  }
}
