package ch.ffhs.rushb.behavior

/**
 * This interface acts as indicator for grabbable objects.
 * In our case, this will be the brush, which may be linked to its holder.
 */
interface Grabbable {
    var movable: Movable?
}