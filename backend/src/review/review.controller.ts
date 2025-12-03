import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ReviewStatus } from '@prisma/client';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // ------------------- Customer Endpoints -------------------

  /**
   * Create a new review (requires authentication)
   * POST /review
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  createReview(
    @Request() req: any,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const userId = req.user?.user_id;
    return this.reviewService.createReview(userId, createReviewDto);
  }

  /**
   * Get all reviews for a specific product (public)
   * GET /review/product/:productId?status=APPROVED
   */
  @Get('product/:productId')
  getProductReviews(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('status') status?: ReviewStatus,
  ) {
    return this.reviewService.getProductReviews(productId, status);
  }

  /**
   * Get product rating statistics (public)
   * GET /review/product/:productId/stats
   */
  @Get('product/:productId/stats')
  getProductRatingStats(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.getProductRatingStats(productId);
  }

  /**
   * Get all reviews by the authenticated user
   * GET /review/my-reviews
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  getUserReviews(@Request() req: any) {
    const userId = req.user?.user_id;
    return this.reviewService.getUserReviews(userId);
  }

  /**
   * Update a review (only by the review owner)
   * PATCH /review/:reviewId
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Request() req: any,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const userId = req.user?.user_id;
    return this.reviewService.updateReview(reviewId, userId, updateReviewDto);
  }

  /**
   * Delete a review (only by the review owner)
   * DELETE /review/:reviewId
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Request() req: any,
  ) {
    const userId = req.user?.user_id;
    return this.reviewService.deleteReview(reviewId, userId);
  }

  // ------------------- Admin Endpoints -------------------

  /**
   * Admin: Get all pending reviews
   * GET /review/admin/pending
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/pending')
  getPendingReviews() {
    return this.reviewService.getPendingReviews();
  }

  /**
   * Admin: Get all reviews (any status)
   * GET /review/admin/all
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  /**
   * Admin: Approve a review
   * PATCH /review/admin/:reviewId/approve
   */
  @UseGuards(JwtAuthGuard)
  @Patch('admin/:reviewId/approve')
  approveReview(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewService.approveReview(reviewId);
  }

  /**
   * Admin: Reject a review
   * PATCH /review/admin/:reviewId/reject
   */
  @UseGuards(JwtAuthGuard)
  @Patch('admin/:reviewId/reject')
  rejectReview(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewService.rejectReview(reviewId);
  }
}
