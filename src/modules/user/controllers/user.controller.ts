import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Body, Controller, Get, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from '../services/user.service';
import { IncomingMessage } from 'http';
import { UpdateProfileData } from "@/modules/user/dto/updateProfileData";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('user')
@ApiTags("사용자")
@ApiBearerAuth(
    "accessToken"
)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get("profile")
    async profile(@Request() req: IncomingMessage) {
        return await this.userService.getProfile(req.userId)
    }

    @Post("profile")
    async updateProfile(@Request() req: IncomingMessage, @Body() data: UpdateProfileData) {
        return await this.userService.updateProfile(req.userId, data)
    }

    @Post("profile/image")
    @UseInterceptors(FileInterceptor('file'))
    async setProfileImage(
      @Request() req: IncomingMessage,
      @UploadedFile() file: Express.Multer.File
    ) {
        return await this.userService.setProfileImage(req.userId, file)
    }

    @Get("dst/header")
    @ApiOperation({
        summary: "헤더 정보",
        description: "헤더 정보를 조회합니다. (로그인 필요)"
    })
    @ApiResponse({
        status: 200,
        description: "헤더 정보 조회 성공",
        content: {
            "application/json": {
                example: {
                    "id": 4,
                    "name": "주현명",
                    "points": 0,
                    "notificationCount": 0
                }
            }
        }
    })
    async header(@Request() req: IncomingMessage) {
        return await this.userService.getDSTHeader(req.userId)
    }

    @Get("dst/home")
    @ApiOperation({
        summary: "홈 화면",
        description: "홈 화면을 조회합니다. (로그인 필요)"
    })
    @ApiResponse({
        status: 200,
        description: "홈 화면 조회 성공",
        content: {
            "application/json": {
                example: {
                    "id": "userId",
                    "element": [
                        {
                            "type": "CAROUSEL_BASIC_CARD",
                            "content": {
                                "topRowText": "SaveQuest 이벤트",
                                "bottomRowText": "홈 화면에서 친추 초대하기"
                            },
                            "right": {
                                "imageUri": "https://sqstatic.ychan.me/character/default0.png?key=wy6hk6y1sx3gcjvkmdhef"
                            },
                            "style": {},
                            "handler": {
                                "type": "APP_SCHEME",
                                "uri": "savequest://screen/quest"
                            }
                        },
                        {
                            "type": "CAROUSEL_PERCENT_CARD",
                            "content": {
                                "topRowText": "이번달 SaveQuest로",
                                "bottomRowColorText": "13만원",
                                "bottomRowText": "아꼈어요"
                            },
                            "right": {
                                "text": "+12*"
                            },
                            "style": {
                                "bottomRowColorText": {
                                    "color": "Primary/300"
                                },
                                "rightText": {
                                    "color": "Primary/400",
                                    "backgroundColor": "Primary/100"
                                }
                            },
                            "handler": {
                                "type": "WEBLINK",
                                "uri": "https://ychan.me"
                            }
                        }
                    ]

                }
            }
        }
    })
    async home(@Request() req: IncomingMessage) {
        return await this.userService.getDSTHome(req.userId)
    }

}
