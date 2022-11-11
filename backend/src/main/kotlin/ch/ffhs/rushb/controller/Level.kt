package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.model.TileMap
import java.lang.Double.MAX_VALUE


class Level(tileMap: TileMap) {

    private val tileSize = tileMap.tileSize
    var tiles = tileMap.tiles.copyOf()

    // ---------------- COLLISION DETECTION ----------------

    fun collidesBottom(character: Movable): Boolean {
        return getDistanceToBottom(character) == 0.0
    }

    fun collidesTop(character: Movable): Boolean {
        return getDistanceToTop(character) == 0.0
    }

    fun collidesLeft(character: Movable): Boolean {
        return getDistanceToLeft(character) == 0.0
    }

    fun collidesRight(character: Movable): Boolean {
        return getDistanceToRight(character) == 0.0
    }

    fun isBelowGroundLevel(character: Movable): Boolean {
        return getDistanceToBottom(character) == MAX_VALUE && character.bottom() > tiles[0].size * tileSize
    }


    // ---------------- COMPUTES DISTANCE TO NEXT SOLID TILE ----------------

    fun getDistanceToBottom(character: Movable): Double {
        val colLeft = (character.left() / tileSize).toInt()
        val colRight = (character.right() / tileSize).toInt()
        val row = (character.bottom() / tileSize).toInt()
        val yOffset = tileSize - (character.bottom() % tileSize)
        var distance = MAX_VALUE
        if (isColCoordinateValid(colLeft) && isColCoordinateValid(colRight) && isRowCoordinateValid(row)) {
            var tempDistance = -1.0
            for (i in row until tiles[0].size) {
                if (tiles[colLeft][i] in 1..9 || tiles[colRight][i] in 1..9) {  // solid tile found
                    distance = tempDistance
                    break
                }
                tempDistance += 1
            }
        }
        if (distance < MAX_VALUE) {
            distance = distance * tileSize + yOffset
            if (distance < 1) {
                distance = 0.0
            }
        }
        return distance
    }

    fun getDistanceToTop(character: Movable): Double {
        val row = (character.top() / tileSize).toInt()
        if (row == 0) {
            return 0.0
        }
        if (isCharacterStuck(character)) {
            return MAX_VALUE
        }
        val colLeft = (character.left() / tileSize).toInt()
        val colRight = (character.right() / tileSize).toInt()
        val yOffset = (character.top() % tileSize)
        var distance = MAX_VALUE
        if (isColCoordinateValid(colLeft) && isColCoordinateValid(colRight) && isRowCoordinateValid(row)) {
            var tempDistance = -1.0
            for (i in row downTo 0) {
                if (tiles[colLeft][i] in 1..9 || tiles[colRight][i] in 1..9) {  // solid tile found
                    distance = tempDistance
                    break
                }
                tempDistance += 1
            }
        } else {
            distance = 0.0
        }
        if (distance < MAX_VALUE) {
            distance = distance * tileSize + yOffset
            if (distance < 1) {
                distance = 0.0
            }
        }
        return distance
    }

    fun getDistanceToLeft(character: Movable): Double {
        val col = (character.left() / tileSize).toInt()
        if (col <= 0) {
            return 0.0
        }
        if (isCharacterStuck(character)) {
            return MAX_VALUE
        }
        val rowTop = (character.top() / tileSize).toInt()
        val rowBottom = ((character.bottom() - 1) / tileSize).toInt()
        val xOffset = (character.left() % tileSize)
        var distance = MAX_VALUE
        if (isRowCoordinateValid(rowTop) && isRowCoordinateValid(rowBottom) && isColCoordinateValid(col)) {
            var tempDistance = -1.0
            for (i in col downTo 0) {
                if (tiles[i][rowTop] in 1..9 || tiles[i][rowBottom] in 1..9) {  // solid tile found
                    distance = tempDistance
                    break
                }
                tempDistance += 1
            }
        }
        if (distance < MAX_VALUE) {
            distance = distance * tileSize + xOffset
            if (distance < 1) {
                distance = 0.0
            }
        }
        return distance
    }

    fun getDistanceToRight(character: Movable): Double {
        val col = (character.right() / tileSize).toInt()
        if (col >= tiles.size - 1) {
            return 0.0
        }
        if (isCharacterStuck(character)) {
            return MAX_VALUE
        }
        val rowTop = (character.top() / tileSize).toInt()
        val rowBottom = ((character.bottom() - 1) / tileSize).toInt()
        val xOffset = tileSize - (character.right() % tileSize)
        var distance = MAX_VALUE
        if (isRowCoordinateValid(rowTop) && isRowCoordinateValid(rowBottom) && isColCoordinateValid(col)) {
            var tempDistance = -1.0
            for (i in col until tiles.size) {
                if (tiles[i][rowTop] in 1..9 || tiles[i][rowBottom] in 1..9) {  // solid tile found
                    distance = tempDistance
                    break
                }
                tempDistance += 1
            }
        }

        if (distance < MAX_VALUE) {
            distance = distance * tileSize + xOffset
            if (distance < 1) {
                distance = 0.0
            }
        }
        return distance
    }

    private fun isCharacterStuck(character: Movable): Boolean {
        val center = character.center().getGridValue()
        if (center.x < 0 || center.x >= tiles.size || center.y < 0 || center.y >= tiles[0].size) {
            return false
        }
        return tiles[center.x.toInt()][center.y.toInt()] != 0
    }

    private fun isCoordinateInvalid(character: Movable): Boolean {
        val center = character.center().getGridValue()
        if (center.x < 0 || center.x >= tiles.size || center.y < 0 || center.y >= tiles[0].size) {
            return true
        }
        return tiles[center.x.toInt()][center.y.toInt()] != 0
    }

    // ---------------- VALIDITY CHECKS ----------------

    private fun isColCoordinateValid(colIndex: Int): Boolean {
        return colIndex >= 0 && colIndex < tiles.size
    }

    private fun isRowCoordinateValid(rowIndex: Int): Boolean {
        return rowIndex >= 0 && rowIndex < tiles[0].size
    }

}