package ch.ffhs.rushb.controller

import ch.ffhs.rushb.model.*
import kotlin.random.Random

class AgentNpc(character: GameObject, level: Level
) : Agent(character, level) {

    override fun applyGameLoop() {
        if (Random.nextBoolean()) {
            if (Random.nextBoolean()) {
                super.setVelocityX(1.0)
            } else {
                super.setVelocityX(-1.0)
            }
        } else {
            if (Random.nextBoolean()) {
                super.setVelocityY()
            }
        }


        super.applyGameLoop()
    }

}