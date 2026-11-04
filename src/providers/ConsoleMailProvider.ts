import { injectable } from 'inversify';
import { IMailProvider, Mail } from './IMailProvider';

@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(mail: Mail): Promise<string | null> {
    console.log('\n===== [ConsoleMailProvider] E-mail =====');
    console.log(`Para:    ${mail.to}`);
    console.log(`Assunto: ${mail.subject}`);
    console.log(mail.text);
    console.log('========================================\n');
    return null;
  }
}
