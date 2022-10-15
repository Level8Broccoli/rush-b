package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Movable
import ch.ffhs.rushb.behavior.Scorable
import ch.ffhs.rushb.behavior.Serializable

abstract class GameObject : Serializable, Movable, Scorable