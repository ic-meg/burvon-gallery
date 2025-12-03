import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly db: DatabaseService) {}


  async createReview(userId: number, dto: CreateReviewDto) {
    const { product_id, order_item_id } = dto;

    // Verify user purchased the product if order_item_id is provided
    if (order_item_id) {
      // First check if the order_item exists
      const orderItem = await this.db.orderItem.findFirst({
        where: {
          order_item_id,
        },
        include: {
          order: true,
        },
      });

      if (!orderItem) {
        throw new ForbiddenException('Order item not found.');
      }

      // Check if the order belongs to this user OR if it was a guest order
      // Guest orders have user_id: null, so we allow reviews if order_item_id is valid
      if (orderItem.order.user_id && orderItem.order.user_id !== userId) {
        throw new ForbiddenException('You cannot review a product you did not purchase.');
      }
    }

    // Check if user already reviewed this product
    const existingReview = await this.db.review.findFirst({
      where: {
        user_id: userId,
        product_id,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You already reviewed this product.');
    }

    // Create review with PENDING status (admin approval required)
    const review = await this.db.review.create({
      data: {
        user_id: userId,
        product_id: dto.product_id,
        order_item_id: dto.order_item_id,
        rating: dto.rating,
        review_text: dto.review_text,
        images: dto.images,
        videos: dto.videos,
        show_username: dto.show_username ?? false,
        status: ReviewStatus.PENDING,
      },
    });

    return { message: 'Review submitted successfully', review };
  }


  async getProductReviews(productId: number, status?: ReviewStatus) {
    const whereCondition: any = {
      product_id: productId,
    };

    // Only filter by status if provided
    if (status) {
      whereCondition.status = status;
    }

    return this.db.review.findMany({
      where: whereCondition,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
      },
    });
  }


  async getUserReviews(userId: number) {
    return this.db.review.findMany({
      where: {
        user_id: userId,
      },
      include: {
        product: true,
      },
    });
  }


  async updateReview(reviewId: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.db.review.findUnique({
      where: { review_id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');

    if (review.user_id !== userId)
      throw new ForbiddenException('You can only update your own review.');

    return this.db.review.update({
      where: { review_id: reviewId },
      data: dto,
    });
  }


  async deleteReview(reviewId: number, userId: number) {
    const review = await this.db.review.findUnique({
      where: { review_id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');

    if (review.user_id !== userId)
      throw new ForbiddenException('You can only delete your own review.');

    await this.db.review.delete({
      where: { review_id: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }

  // -----------------------------------------------------
  // ADMIN METHODS
  // -----------------------------------------------------

  /**
   * Admin: Approve a review
   */
  async approveReview(reviewId: number) {
    const review = await this.db.review.findUnique({
      where: { review_id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');

    return this.db.review.update({
      where: { review_id: reviewId },
      data: { status: ReviewStatus.APPROVED },
    });
  }

  /**
   * Admin: Reject a review
   */
  async rejectReview(reviewId: number) {
    const review = await this.db.review.findUnique({
      where: { review_id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');

    return this.db.review.update({
      where: { review_id: reviewId },
      data: { status: ReviewStatus.REJECTED },
    });
  }

  /**
   * Admin: Get all pending reviews
   */
  async getPendingReviews() {
    return this.db.review.findMany({
      where: { status: ReviewStatus.PENDING },
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
          },
        },
        product: {
          select: {
            product_id: true,
            name: true,
            images: true,
          },
        },
      },
    });
  }

  /**
   * Admin: Get all reviews (any status)
   */
  async getAllReviews() {
    return this.db.review.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
          },
        },
        product: {
          select: {
            product_id: true,
            name: true,
            images: true,
          },
        },
      },
    });
  }

  /**
   * Get product rating statistics
   */
  async getProductRatingStats(productId: number) {
    const reviews = await this.db.review.findMany({
      where: {
        product_id: productId,
        status: ReviewStatus.APPROVED,
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRatings / totalReviews;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      ratingDistribution[r.rating]++;
    });

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      ratingDistribution,
    };
  }
}
