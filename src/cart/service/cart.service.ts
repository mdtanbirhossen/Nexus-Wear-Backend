import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entity/cart.entity';
import { CartItem } from '../entity/cart-item.entity';
import { CreateCartDto } from '../dto/create-cart.dto';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  // Create Cart
  async createCart(createCartDto: CreateCartDto): Promise<Cart> {
    const { items, ...cartData } = createCartDto;

    const cart = this.cartRepository.create(cartData);
    if (items && items.length > 0) {
      const cartItems = items.map((item) =>
        this.cartItemRepository.create(item),
      );
      cart.items = cartItems;
    }

    return await this.cartRepository.save(cart);
  }

  // Add Item to Existing Cart
  async addCartItem(cartId: string, dto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItem = this.cartItemRepository.create({
      ...dto,
      cart,
    });

    return await this.cartItemRepository.save(cartItem);
  }

  // Get Cart by ID
  async getCart(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.size', 'items.color'],
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  // Get Cart by Customer ID
  async getCartByCustomerId(customerId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { customerId },
      relations: ['items', 'items.product', 'items.size', 'items.color'],
    });

    if (!cart)
      throw new NotFoundException(
        `Cart not found for customer with ID ${customerId}`,
      );

    return cart;
  }

  // Get Cart by Session ID
  async getCartBySessionId(sessionId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { sessionId },
      relations: ['items', 'items.product', 'items.size', 'items.color'],
    });

    if (!cart)
      throw new NotFoundException(`Cart not found for session: ${sessionId}`);

    return cart;
  }

  // Get Cart Item by ID
  async getCartItem(id: string): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['product', 'size', 'color', 'cart'],
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');
    return cartItem;
  }

  // Update Cart
  async updateCart(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) throw new NotFoundException('Cart not found');

    Object.assign(cart, updateCartDto);
    return await this.cartRepository.save(cart);
  }

  // Update Cart Item
  async updateCartItem(id: string, dto: UpdateCartItemDto): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    Object.assign(cartItem, dto);
    return await this.cartItemRepository.save(cartItem);
  }

  // Delete Cart
  async deleteCart(id: string): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) throw new NotFoundException('Cart not found');

    await this.cartRepository.remove(cart);
  }

  // Delete Cart Item
  async deleteCartItem(id: string): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.cartItemRepository.remove(cartItem);
  }
}
