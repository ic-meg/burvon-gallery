import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistService {
    constructor(private readonly databaseService: DatabaseService) {}

    async createWishlist(dto: CreateWishlistDto) {
        // Check if item already exists in wishlist
        const existingItem = await this.databaseService.wishlist.findFirst({
            where: {
                user_id: dto.user_id,
                product_id: dto.product_id,
            }
        });

        if (existingItem) {
            throw new NotFoundException('Item already in wishlist');
        }

        const wishlist = await this.databaseService.wishlist.create({
            data: {
                ...dto,
            },
            include: {
                product: true,
                user: true,
            }
        });
        return { wishlist };
    }

    async getUserWishlist(user_id: number) {
        const wishlistItems = await this.databaseService.wishlist.findMany({
            where: { user_id },
            include: {
                product: true,
            },
            orderBy: { added_at: 'desc' }
        });
        
        if (wishlistItems.length === 0) {
            throw new NotFoundException('Wishlist is empty');
        }
        return { wishlistItems };
    }

    async findOne(wishlist_id: number) {
        const wishlistItem = await this.databaseService.wishlist.findUnique({
            where: { wishlist_id },
            include: {
                product: true,
                user: true,
            }
        });
        
        if (!wishlistItem) {
            throw new NotFoundException('Wishlist item not found');
        }
        return { wishlistItem };
    }

    async updateWishlist(wishlist_id: number, updateWishlistDto: UpdateWishlistDto) {
        const updateWishlist = await this.databaseService.wishlist.update({
            where: { wishlist_id },
            data: { ...updateWishlistDto },
            include: {
                product: true,
                user: true,
            }
        });
        
        if (!updateWishlist) {
            throw new NotFoundException('Wishlist item not found');
        }
        return { message: 'Wishlist updated successfully', updateWishlist };
    }

    async removeFromWishlist(wishlist_id: number) {
        const deleteWishlist = await this.databaseService.wishlist.delete({
            where: { wishlist_id },
        });
        
        if (!deleteWishlist) {
            throw new NotFoundException('Wishlist item not found');
        }
        return { message: 'Item removed from wishlist successfully', deleteWishlist };
    }

    async removeByProductAndUser(user_id: number, product_id: number) {
        const deleteWishlist = await this.databaseService.wishlist.deleteMany({
            where: { 
                user_id,
                product_id 
            },
        });
        
        if (deleteWishlist.count === 0) {
            throw new NotFoundException('Wishlist item not found');
        }
        return { message: 'Item removed from wishlist successfully', deleteWishlist };
    }

    async clearUserWishlist(user_id: number) {
        const deleteResult = await this.databaseService.wishlist.deleteMany({
            where: { user_id },
        });
        
        return { message: 'Wishlist cleared successfully', deletedCount: deleteResult.count };
    }

    async isInWishlist(user_id: number, product_id: number) {
        const wishlistItem = await this.databaseService.wishlist.findFirst({
            where: {
                user_id,
                product_id,
            }
        });
        
        return { isInWishlist: !!wishlistItem };
    }
}