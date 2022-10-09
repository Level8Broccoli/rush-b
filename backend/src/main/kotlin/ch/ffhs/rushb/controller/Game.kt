package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.*
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled

@Configuration
@EnableScheduling
class Game {

    private val player1 = Player(
        "test-id",
        "red",
        VectorDto(16.0, 0.0),
        TileMap.ONE
    );
    private val player2 = Player(
        "dummy-player",
        "purple",
        VectorDto(32.0, 0.0),
        TileMap.ONE
    );

    @Scheduled(fixedRate = 200)
    fun fixedRateScheduledTask() {
        player1.applyGameLoop()
        player2.applyGameLoop()
        //TODO: make players interact
    }

    fun getPlayer1(): Player {
        return player1;
    }

    fun getCharacter1(): CharacterDto {
        return player1.character;
    }

}
