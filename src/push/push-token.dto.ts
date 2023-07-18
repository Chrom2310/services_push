export class TokenDto {
  token: string;
  username: string;
  device: string;
}

export class TopicDto {
  topic: string;
  title: string;
}

export class TokenQueryDto {
  username: string;
}

export class TopicQueryDto {
  title: string;
}

export class RemoveDocDto {
  id: string;
}

export class SendPushDto {
  tokenId: string;
  body: any;
  configId?: string;
}
