import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Transactional } from "typeorm-transactional";
import { StaticFileService } from "@/modules/staticfile/service/staticfile.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly staticFileService: StaticFileService,
    ) { }

    @Transactional()
    async getUserOrCreate(phoneNumber: string) {
        const user = await this.userRepository.findOne({
            where: { phoneNumber }
        })

        if (user !== null) return user

        return await this.userRepository.save({
            phoneNumber, name: "홍길동"
        })
    }

    async getProfile(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } , relations: ['quests']});
        return {
            id: userId,
            name: user.name,
            level: user.level,
            tag: user.titleBadge,
            profileImage: user.profileImageId ? await this.staticFileService.StaticFile(userId, user.profileImageId) : null,
            element: [
                {
                    name: "지금까지 줄인 소비금액",
                    value: `₩ ${user.totalSavedUsage.toLocaleString('ko-KR')}`
                }, {
                    name: "성공한 도전과제",
                    value: `${user.quests.filter(q => q.status === "completed").length}개`
                }
            ],
            questLog: {
                totalEarned: user.totalEarned.quest,
                totalCompleted: user.quests.filter(q => q.status === "completed").length,
                totalFailed: user.quests.filter(q => q.status === "failed").length,
            }
        }
    }

    async getDSTHeader(userId: number) {
        const user = await this.userRepository.findOne({where: {id: userId}, select: ["name", "points", "notifications"] });
        return {
            id: userId, name: user.name, points: user.points, notificationCount: user.notifications?.length || 0
        }
    }

    async getDSTHome(userId: number) {
        return {
            id: userId,
            elements: [
                {
                    type: "CAROUSEL_BASIC_CARD",
                    content: {
                        topRowText: "SaveQuest 정식 출시",
                        bottomRowText: "Play Store에서 SaveQuest 리뷰 남기기"
                    },
                    right: {
                        imageUri: await this.staticFileService.StaticFile(userId, "/dstCarouselImage/70a3ceae-d5dc-463e-a98b-48d6243a6a80.png")
                    },
                    handler: {
                        type: "WEBLINK",
                        url: "https://play.google.com/store/apps/details?id=me.ychan.savequest"
                    }
                }
            ]
        }
    }

    findUserById(userId: number) {
        return this.userRepository.findOne({ where: { id: userId } })
    }

    insertUser(){
        //return this.
    }
}