import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
    constructor(private readonly databaseService: DatabaseService) {}

        async createCollection(dto: CreateCollectionDto) {
            const collection = await this.databaseService.collection.create({
                data: {
                    ...dto,
                }
            });
            return { collection };
        }

        async getCollections() {
            const collections = await this.databaseService.collection.findMany({
                include: {
                    CollectionContent: true,
                },
            });
            if(collections.length === 0) {  
                throw new NotFoundException('No collections found');
            }
            return { collections };
        }

        async findOne(id: number) {
            const findOne = await this.databaseService.collection.findUnique({
                where: { collection_id: id },
                include: {
                    CollectionContent: true,
                },
            });
            if(!findOne) {
                throw new NotFoundException('Collection not found');
            }
            return { findOne }; 
        }

        async updateCollection(id: number, updateCollectionDto: UpdateCollectionDto) {
            const updateCollections = await this.databaseService.collection.update({
                where: { collection_id: id },
                data: { ...updateCollectionDto },
            });
            if (!updateCollections) {
                throw new NotFoundException('Collection not found');
            }
            return { message : 'Collection updated successfully', updateCollections };
        }   

        async remove(id: number) {
            const deleteCollection = await this.databaseService.collection.delete({
                where: { collection_id: id },
            });
            if (!deleteCollection) {
                throw new NotFoundException('Collection not found');
            }
            return { message: 'Collection deleted successfully', deleteCollection };
    }
}