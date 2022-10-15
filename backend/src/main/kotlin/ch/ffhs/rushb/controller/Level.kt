package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.model.TileMap
import java.lang.Double.MAX_VALUE


class Level(val tileMap: TileMap) {

    private val tileSize = tileMap.tileSize


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
        return getDistanceToBottom(character) == MAX_VALUE && character.bottom() > tileMap.tiles[0].size * tileSize
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
            for (i in row until tileMap.tiles[0].size) {
                if (tileMap.tiles[colLeft][i] > 0 || tileMap.tiles[colRight][i] > 0) {  // solid tile found
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
        val colLeft = (character.left() / tileSize).toInt()
        val colRight = (character.right() / tileSize).toInt()
        val row = (character.top() / tileSize).toInt()
        val yOffset = (character.top() % tileSize)
        var distance = MAX_VALUE
        if (isColCoordinateValid(colLeft) && isColCoordinateValid(colRight) && isRowCoordinateValid(row)) {
            var tempDistance = -1.0
            for (i in row downTo 0) {
                if (tileMap.tiles[colLeft][i] > 0 || tileMap.tiles[colRight][i] > 0) {  // solid tile found
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

    fun getDistanceToLeft(character: Movable): Double {
        val rowTop = (character.top() / tileSize).toInt()
        val rowBottom = ((character.bottom() - 1) / tileSize).toInt()
        val col = (character.left() / tileSize).toInt()
        val xOffset = (character.left() % tileSize)
        var distance = MAX_VALUE
        if (isRowCoordinateValid(rowTop) && isRowCoordinateValid(rowBottom) && isColCoordinateValid(col)) {
            var tempDistance = -1.0
            for (i in col downTo 0) {
                if (tileMap.tiles[i][rowTop] > 0 || tileMap.tiles[i][rowBottom] > 0) {  // solid tile found
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
        val rowTop = (character.top() / tileSize).toInt()
        val rowBottom = ((character.bottom() - 1) / tileSize).toInt()
        val col = (character.right() / tileSize).toInt()
        val xOffset = tileSize - (character.right() % tileSize)
        var distance = MAX_VALUE
        if (isRowCoordinateValid(rowTop) && isRowCoordinateValid(rowBottom) && isColCoordinateValid(col)) {
            var tempDistance = -1.0
            for (i in col until tileMap.tiles.size) {
                if (tileMap.tiles[i][rowTop] > 0 || tileMap.tiles[i][rowBottom] > 0) {  // solid tile found
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

    // ---------------- VALIDITY CHECKS ----------------

    private fun isColCoordinateValid(colIndex: Int): Boolean {
        return colIndex >= 0 && colIndex < tileMap.tiles.size
    }

    private fun isRowCoordinateValid(rowIndex: Int): Boolean {
        return rowIndex >= 0 && rowIndex < tileMap.tiles[0].size
    }

}