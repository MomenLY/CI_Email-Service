import { BadRequestException, Injectable } from '@nestjs/common';
import { Subscriber } from 'src/subscriber/entities/subscriber.entity';
import { SES } from 'aws-sdk';
import { ErrorMessages, SuccessMessages } from 'src/utils/messages';

@Injectable()
export class ServicesService {
  private ses: SES;

  constructor() {
    this.ses = new SES({
      region: process.env.AWS_REGION, // replace with your AWS region
      accessKeyId: process.env.AWS_ACCESSKEY_ID, // replace with your AWS access key ID
      secretAccessKey: process.env.AWS_SECRETACCESS_KEY, // replace with your AWS secret access key
    });
  }

  accountValidation = async (authToken: string) => {
    if (authToken) {
      const subscriber = await Subscriber.findOne({
        where: { SAuthCode: authToken },
      });
      return subscriber;
    } else {
      return false;
    }
  };

  sendVerificationEmail = async (authToken: string) => {
    try {
      const subscriber = await this.accountValidation(authToken);
      if (subscriber) {
        if (subscriber.SFromEmailId) {
          const emailAddress = subscriber.SFromEmailId;
          const params = {
            EmailAddress: emailAddress,
          };
          const res = await this.ses.verifyEmailAddress(params).promise();
          if (res) {
            return {
              message:
                SuccessMessages.VERIFICATION_EMAIL_SENT + ` ${emailAddress}`,
            };
          } else {
            throw new Error(
              ErrorMessages.FAILED_TO_SEND_VERIFICATION_EMAIL +
                ` ${emailAddress}`,
            );
          }
        } else {
          throw new BadRequestException(
            ErrorMessages.EMAIL_ADDRESS_NOT_AVAILABLE_UPDATE,
          );
        }
      } else {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      }
    } catch (e) {
      throw e;
    }
  };

  async isEmailVerified(authToken: string) {
    try {
      const subscriber = await this.accountValidation(authToken);
      if (subscriber) {
        if (subscriber.SFromEmailId) {
          const response = await this.ses
            .getIdentityVerificationAttributes({
              Identities: [subscriber.SFromEmailId],
            })
            .promise();
          const verificationAttributes = response.VerificationAttributes;
          const verificationStatus =
            verificationAttributes[subscriber.SFromEmailId]?.VerificationStatus;
          return verificationStatus === 'Success';
        } else {
          throw new BadRequestException(
            ErrorMessages.EMAIL_ADDRESS_NOT_AVAILABLE_UPDATE,
          );
        }
      } else {
        throw new BadRequestException(ErrorMessages.SUBSCRIBER_NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }
}
