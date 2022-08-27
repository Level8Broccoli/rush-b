package ch.ffhs.rushb.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class HtmlController {

    @GetMapping("/")
    @ResponseBody
    fun welcome(): String {
        return "hello world"
    }

    @GetMapping("/error")
    fun showError(): String {
        return "oopsie"
    }

}