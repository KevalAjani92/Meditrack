import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { BillingPaymentsService } from './billing-payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsQueryDto } from './dto/get-payments-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('receptionist/payments')
@UseGuards(JwtAuthGuard)
export class BillingPaymentsController {
  constructor(private readonly paymentsService: BillingPaymentsService) {}

  // Get active payment modes
  @Get('modes')
  getPaymentModes() {
    return this.paymentsService.getPaymentModes();
  }

  // List payments with filters, pagination, stats
  @Get(':hospital_id')
  getPayments(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Query() query: GetPaymentsQueryDto,
  ) {
    return this.paymentsService.getPayments(hospitalId, query);
  }

  // Record a payment
  @Post(':hospital_id')
  recordPayment(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Body() dto: CreatePaymentDto,
    @Req() req,
  ) {
    const userId = Number(req.user.sub);
    return this.paymentsService.recordPayment(hospitalId, dto, userId);
  }

  // Get payment detail
  @Get(':hospital_id/:payment_id')
  getPaymentDetail(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('payment_id', ParseIntPipe) paymentId: number,
  ) {
    return this.paymentsService.getPaymentDetail(hospitalId, paymentId);
  }

  // Get receipt print data
  @Get(':hospital_id/:payment_id/print')
  getReceiptPrintData(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('payment_id', ParseIntPipe) paymentId: number,
  ) {
    return this.paymentsService.getReceiptPrintData(hospitalId, paymentId);
  }

  // Generate receipt PDF
  @Get(':hospital_id/:payment_id/pdf')
  async getReceiptPdf(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('payment_id', ParseIntPipe) paymentId: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.paymentsService.generateReceiptPdf(
      hospitalId,
      paymentId,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="receipt-${paymentId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
