import { Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

import { sign } from 'jsonwebtoken'; // Import the sign function from jsonwebtoken
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  // constructor() {
  //   this.transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //       user: 'sibhanali19@gmail.com',
  //       pass: 'rcif rwmx myyk yjmm',
  //     },
  //   });
  // }

  constructor(private userService: UserService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sibhanali19@gmail.com',
        pass: 'rcif rwmx myyk yjmm',
      },
    });
  }

  async sendEmail(emailData: { to: string }, companyId: number) {
    const { to } = emailData;
    const subject = 'Invitation Email';

    // Generate a token with the user's role ('NORMAL_USER_ROLE')
    const token = sign(
      { email: to, role: 'NORMAL_USER_ROLE', company: companyId },
      'JWT_KEY',
    );

    // Construct the registration link with the token
    const registrationLink = `http://localhost:3000/?token=${token}`;

    const text = `
    Dear User,<br><br>
    We are excited to invite you to join our Leave Board for our Company. 
    Your presence is important to us, and we look forward to having you as part of our team.<br><br>
    To get started, please click the following link to register and begin your journey with us:
    <a href="${registrationLink}">Click Here to Join Us</a><br><br>
    Thank you for choosing our company. We can't wait to have you on board!<br><br>
    Sincerely,
    Leave Board Management.`;

    const mailOptions = {
      from: 'sibhanali19@gmail.com',
      to,
      subject,
      html: text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      // console.log(`Email sent: ${info.response}`);
      return { message: 'Email sent successfully', status: 'success' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { message: 'Email could not be sent', status: 'failure' };
    }
  }

  async resetEmail(emailData: { to: string }) {
    const { to } = emailData;
    const subject = 'Reset your Password';
    const user = await this.userService.findUserByEmail(to);

    if (!user) {
      return { message: 'Email not found', status: 'failure' };
    } else {
      const resetKey = Math.floor(1000 + Math.random() * 9000);

      const text = `
        Dear User,<br><br>
        Your password reset code is: ${resetKey}<br><br>
        Please use this code to reset your password.<br><br>
        Do not share this key with any one, it may cause security threat.<br><br>
        Thanks,
        Leave Board Management.`;

      const mailOptions = {
        from: 'sibhanali19@gmail.com',
        to,
        subject,
        html: text,
      };
      this.userService.updateResetKey(to, resetKey.toString());
      try {
        const info = await this.transporter.sendMail(mailOptions);
        // console.log(`Email sent: ${info.response}`);
        return { message: 'Email sent successfully', status: 'success' };
      } catch (error) {
        console.error('Error sending email:', error);
        return { message: 'Email could not be sent', status: 'failure' };
      }
    }
  }
}
