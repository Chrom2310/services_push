import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const basePath = 'tmp/';
export default class LocalDb<Doc> {
  private readonly basePath = basePath;
  private readonly path: string = basePath;
  private readonly name: string = '';
  public doc: Doc[] = [];
  constructor(path: string) {
    this.name = path;
    this.path = this.path + path;
    this.createDir(this.getDoc);
    // this.getDoc();
  }

  setDoc(doc: Doc) {
    fs.writeFile(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      `${this.path}/${doc?.id || uuidv4()}.json`,
      JSON.stringify(doc),
      (err) => {
        if (err) throw 'err file ' + err.message;
        this.doc.push(doc);
      },
    );
  }

  createDir(callback: () => void) {
    fs.readdir(this.basePath, (err, file) => {
      if (err) throw 'err file ' + err.message;
      if (!file.includes(this.name)) {
        fs.mkdir(this.path, { recursive: true }, (err) => {
          if (err) throw 'err file ' + err.message;
        });
      } else {
        callback();
      }
      console.log('file', file);
    });
  }

  getDoc = () => {
    fs.readdir(this.path, (err, files) => {
      if (err) throw 'err file ' + err.message;
      files.forEach((file) => {
        fs.readFile(`${this.path}/${file}`, 'utf8', (err, data) => {
          if (err) throw 'err file ' + err.message;
          this.doc.push(JSON.parse(data));
        });
        console.log('file', file);
      });
    });
  };

  removeDoc(id: string) {
    fs.unlink(`${this.path}/${id}`, (err) => {
      if (err) throw 'err file ' + err.message;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.doc.filter((el) => (el.id as string) !== id);
    });
  }
}
