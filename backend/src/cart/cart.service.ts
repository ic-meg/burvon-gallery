import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
    constructor(private readonly databaseService: DatabaseService) {}

    async createCart(dto: CreateCartDto) {
        // Check if item already exists in cart
        const existingItem = await this.databaseService.cart.findFirst({
            where: {
                user_id: dto.user_id,
                product_id: dto.product_id,
            }
        });

        if (existingItem) {
            // Update quantity if item exists
            return this.updateCart(existingItem.cart_id, { quantity: existingItem.quantity + (dto.quantity || 1) });
        }

        const cart = await this.databaseService.cart.create({
            data: {
                ...dto,
            },
            include: {
                product: true,
                user: true,
            }
        });
        return { cart };
    }

    async getUserCart(user_id: number) {
        const cartItems = await this.databaseService.cart.findMany({
            where: { user_id },
            include: {
                product: true,
            },
            orderBy: { added_at: 'desc' }
        });
        
        if (cartItems.length === 0) {
            throw new NotFoundException('Cart is empty');
        }
        return { cartItems };
    }

    async findOne(cart_id: number) {
        const cartItem = await this.databaseService.cart.findUnique({
            where: { cart_id },
            include: {
                product: true,
                user: true,
            }
        });
        
        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }
        return { cartItem };
    }

    async updateCart(cart_id: number, updateCartDto: UpdateCartDto) {
        const updateCart = await this.databaseService.cart.update({
            where: { cart_id },
            data: { ...updateCartDto },
            include: {
                product: true,
                user: true,
            }
        });
        
        if (!updateCart) {
            throw new NotFoundException('Cart item not found');
        }
        return { message: 'Cart updated successfully', updateCart };
    }

    async removeFromCart(cart_id: number) {
        const deleteCart = await this.databaseService.cart.delete({
            where: { cart_id },
        });
        
        if (!deleteCart) {
            throw new NotFoundException('Cart item not found');
        }
        return { message: 'Item removed from cart successfully', deleteCart };
    }

    async clearUserCart(user_id: number) {
        const deleteResult = await this.databaseService.cart.deleteMany({
            where: { user_id },
        });
        
        return { message: 'Cart cleared successfully', deletedCount: deleteResult.count };
    }

    async mergeCarts(user_id: number, localCart: any[]) {
        // Clear existing cart
        await this.clearUserCart(user_id);
        
        // Add items from local cart
        const cartItems: any[] = [];
        for (const item of localCart) {
            const cartItem = await this.databaseService.cart.create({
                data: {
                    user_id,
                    product_id: item.product_id,
                    quantity: item.quantity || 1,
                },
                include: {
                    product: true,
                }
            });
            cartItems.push(cartItem);
        }
        
        return { message: 'Cart merged successfully', cartItems };
    }
}