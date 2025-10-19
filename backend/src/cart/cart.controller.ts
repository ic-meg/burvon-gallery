import { Body, Controller, Get, ParseIntPipe, Post, Param, Patch, Delete, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    create(@Body() createCartDto: CreateCartDto) {
        return this.cartService.createCart(createCartDto);
    }

    @Get('user/:user_id')
    getUserCart(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.cartService.getUserCart(user_id);
    }

    @Get(':cart_id')
    findOne(@Param('cart_id', ParseIntPipe) cart_id: number) {
        return this.cartService.findOne(cart_id);
    }

    @Patch(':cart_id')
    update(@Param('cart_id', ParseIntPipe) cart_id: number, @Body() updateCartDto: UpdateCartDto) {
        return this.cartService.updateCart(cart_id, updateCartDto);
    }

    @Delete(':cart_id')
    remove(@Param('cart_id', ParseIntPipe) cart_id: number) {
        return this.cartService.removeFromCart(cart_id);
    }

    @Delete('user/:user_id/clear')
    clearUserCart(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.cartService.clearUserCart(user_id);
    }

    @Post('merge/:user_id')
    mergeCarts(@Param('user_id', ParseIntPipe) user_id: number, @Body() localCart: any[]) {
        return this.cartService.mergeCarts(user_id, localCart);
    }
}