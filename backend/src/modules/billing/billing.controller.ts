import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Res,
  Req,
  UseGuards,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { BillingService } from './billing.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { GetVisitsQueryDto } from './dto/get-visits-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('receptionist/billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // Search OPD visits for billing
  @Get(':hospital_id/visits')
  searchVisits(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Query() query: GetVisitsQueryDto,
  ) {
    return this.billingService.searchVisits(hospitalId, query);
  }

  // Get visit details with auto-collected billable items
  @Get(':hospital_id/visits/:visit_id')
  getVisitDetails(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('visit_id', ParseIntPipe) visitId: number,
  ) {
    return this.billingService.getVisitDetails(hospitalId, visitId);
  }

  // Create a new bill
  @Post(':hospital_id')
  createBill(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Body() dto: CreateBillDto,
    @Req() req,
  ) {
    const userId = Number(req.user.sub);
    return this.billingService.createBill(hospitalId, dto, userId);
  }

  // Get bill by visit_id (MUST be before :bill_id routes)
  @Get(':hospital_id/by-visit/:visit_id')
  getBillByVisit(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('visit_id', ParseIntPipe) visitId: number,
  ) {
    return this.billingService.getBillByVisit(hospitalId, visitId);
  }

  // Get bill print data
  @Get(':hospital_id/:bill_id/print')
  getBillPrintData(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('bill_id', ParseIntPipe) billId: number,
  ) {
    return this.billingService.getBillPrintData(hospitalId, billId);
  }

  // Generate and return bill PDF
  @Get(':hospital_id/:bill_id/pdf')
  async getBillPdf(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('bill_id', ParseIntPipe) billId: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.billingService.generateBillPdf(
      hospitalId,
      billId,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bill-${billId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  // Finalize a draft bill
  @Patch(':hospital_id/:bill_id/finalize')
  finalizeBill(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('bill_id', ParseIntPipe) billId: number,
  ) {
    const userId = 1;
    return this.billingService.finalizeBill(hospitalId, billId, userId);
  }

  // Get full bill details (MUST be last :bill_id route)
  @Get(':hospital_id/:bill_id')
  getBill(
    @Param('hospital_id', ParseIntPipe) hospitalId: number,
    @Param('bill_id', ParseIntPipe) billId: number,
  ) {
    return this.billingService.getBill(hospitalId, billId);
  }
}
