import { Controller, Get, Param, ParseUUIDPipe, Patch, Body } from '@nestjs/common';
import { AddressService } from '../service/address.service';
import { AddressDto } from '../dto/address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('customer/:customerId')
  getAddressByCustomer(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.addressService.getAddressByCustomerId(customerId);
  }

  @Patch('customer/:customerId')
  saveAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: AddressDto,
  ) {
    return this.addressService.saveAddress(customerId, dto);
  }
}
