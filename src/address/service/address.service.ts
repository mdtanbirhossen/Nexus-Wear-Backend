import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entity/address.entity';
import { Repository } from 'typeorm';
import { AddressDto } from '../dto/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async getAddressByCustomerId(customerId: string) {
    const address = await this.addressRepository.findOne({
      where: { customerId },
      order: { id: 'DESC' },
    });
    return { data: address };
  }

  async saveAddress(customerId: string, dto: AddressDto) {
    let address = await this.addressRepository.findOne({ where: { customerId } });
    if (address) {
      Object.assign(address, dto);
    } else {
      address = this.addressRepository.create({ ...dto, customerId });
    }
    await this.addressRepository.save(address);
    return { data: address, message: 'Address saved perfectly' };
  }
}
