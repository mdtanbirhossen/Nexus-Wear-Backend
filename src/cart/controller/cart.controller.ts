import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from '../service/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 🛒 Create a new cart
  @Post()
  @ApiOperation({ summary: 'Create a new cart (for customer or session)' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  async createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  // 🧩 Add item to an existing cart
  @Post(':cartId/items')
  @ApiOperation({ summary: 'Add an item to an existing cart' })
  @ApiResponse({ status: 201, description: 'Cart item added successfully' })
  async addCartItem(
    @Param('cartId', ParseUUIDPipe) cartId: string,
    @Body() dto: CreateCartItemDto,
  ) {
    return this.cartService.addCartItem(cartId, dto);
  }

  // 🔍 Get cart by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get cart by ID' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartService.getCart(id);
  }

  // 🔍 Get cart by customer ID
  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get cart by customer ID (for logged-in users)' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCartByCustomerId(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ) {
    return this.cartService.getCartByCustomerId(customerId);
  }

  // 🔍 Get cart by session ID
  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get cart by session ID (for guest users)' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCartBySessionId(@Param('sessionId') sessionId: string) {
    return this.cartService.getCartBySessionId(sessionId);
  }

  // 🔍 Get cart item by ID
  @Get('item/:id')
  @ApiOperation({ summary: 'Get a single cart item by ID' })
  @ApiResponse({ status: 200, description: 'Cart item retrieved successfully' })
  async getCartItem(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartService.getCartItem(id);
  }

  // ✏️ Update cart
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing cart' })
  @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  async updateCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.updateCart(id, updateCartDto);
  }

  // ✏️ Update cart item
  @Patch('item/:id')
  @ApiOperation({ summary: 'Update a cart item' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  async updateCartItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(id, dto);
  }

  // 🗑️ Delete cart
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart and all related items' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  async deleteCart(@Param('id', ParseUUIDPipe) id: string) {
    await this.cartService.deleteCart(id);
    return { message: 'Cart deleted successfully' };
  }

  // 🗑️ Delete cart item
  @Delete('item/:id')
  @ApiOperation({ summary: 'Delete a specific cart item' })
  @ApiResponse({ status: 200, description: 'Cart item deleted successfully' })
  async deleteCartItem(@Param('id', ParseUUIDPipe) id: string) {
    await this.cartService.deleteCartItem(id);
    return { message: 'Cart item deleted successfully' };
  }
}
