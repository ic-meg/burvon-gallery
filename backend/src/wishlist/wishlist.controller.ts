import { Body, Controller, Get, ParseIntPipe, Post, Param, Patch, Delete, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

    @Post()
    create(@Body() createWishlistDto: CreateWishlistDto) {
        return this.wishlistService.createWishlist(createWishlistDto);
    }

    @Get('user/:user_id')
    getUserWishlist(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.wishlistService.getUserWishlist(user_id);
    }

    @Get('check/:user_id/:product_id')
    isInWishlist(@Param('user_id', ParseIntPipe) user_id: number, @Param('product_id', ParseIntPipe) product_id: number) {
        return this.wishlistService.isInWishlist(user_id, product_id);
    }

    @Get(':wishlist_id')
    findOne(@Param('wishlist_id', ParseIntPipe) wishlist_id: number) {
        return this.wishlistService.findOne(wishlist_id);
    }

    @Patch(':wishlist_id')
    update(@Param('wishlist_id', ParseIntPipe) wishlist_id: number, @Body() updateWishlistDto: UpdateWishlistDto) {
        return this.wishlistService.updateWishlist(wishlist_id, updateWishlistDto);
    }

    @Delete(':wishlist_id')
    remove(@Param('wishlist_id', ParseIntPipe) wishlist_id: number) {
        return this.wishlistService.removeFromWishlist(wishlist_id);
    }

    @Delete('user/:user_id/product/:product_id')
    removeByProductAndUser(@Param('user_id', ParseIntPipe) user_id: number, @Param('product_id', ParseIntPipe) product_id: number) {
        return this.wishlistService.removeByProductAndUser(user_id, product_id);
    }

    @Delete('user/:user_id/clear')
    clearUserWishlist(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.wishlistService.clearUserWishlist(user_id);
    }
}