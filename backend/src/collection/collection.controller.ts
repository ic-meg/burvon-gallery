import { Body, Controller, Get, ParseIntPipe, Post, Param, Patch, Delete} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Post()
    create(@Body() createCollectionDto: CreateCollectionDto) {
        return this.collectionService.createCollection(createCollectionDto);
    }

    @Get()
    findAll(){ 
        return this.collectionService.getCollections();
    }

    @Get(':collection_id')
    findOne(@Param('collection_id', ParseIntPipe) collection_id: number) {
        return this.collectionService.findOne(collection_id);
    }

    @Patch(':collection_id')
    update(@Param('collection_id', ParseIntPipe) collection_id: number, @Body() updateCollectionDto: UpdateCollectionDto) {
        return this.collectionService.updateCollection(collection_id, updateCollectionDto);
    }

    @Delete(':collection_id')
    delete(@Param('collection_id', ParseIntPipe) collection_id: number) {
        return this.collectionService.remove(collection_id);    
    }
}   
    