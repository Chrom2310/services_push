import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TokenDto, TopicDto } from './push-token.dto';
import { Config, Token, Topic } from './token.interface';
import LocalDb from './localDb';
import { FbAdmin } from './FbAdmin';

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

  async removeToken(idToken: string) {
    await this.tokens.removeDoc(idToken);
    return this.tokens.doc;
  }

  async removeTopic(idTopic: string) {
    await this.topics.removeDoc(idTopic);
    return this.topics.doc;
  }

  async removeConfig(idConfig: string) {
    await this.config.removeDoc(idConfig);
    return this.config.doc;
  }

  setConfig(config: any) {
    const newConfig = { ...config, id: uuidv4() };
    this.config.setDoc(newConfig);
    return newConfig;
  }

  getConfig() {
    return this.config.doc;
  }

  async sendPushTopic(topicId: string, body: any, configId?: string) {
    const config: Config = configId
      ? this.config.doc.find((el) => el.id === configId) || this.config.doc[0]
      : this.config.doc[0];
    const admin = new FbAdmin(config);
    const topic = this.topics.doc.find((el) => el.id === topicId);
    if (topic) {
      const result = await admin.sendTopic(topicId, body);
      await admin.close();
      return result;
    }
    throw new BadRequestException('not topic');
  }

  async sendPushToken(tokenId: string, body: any, configId?: string) {
    const config: Config = configId
      ? this.config.doc.find((el) => el.id === configId) || this.config.doc[0]
      : this.config.doc[0];

    const admin = new FbAdmin(config);
    const token = this.tokens.doc.find((el) => el.id === tokenId);
    if (token) {
      const result = await admin.sendToken(token?.token, body);
      await admin.close();
      return result;
    }
    throw new BadRequestException('not token');
  }
}
