/**
 * @name Sandwich
 * @author Pr4xy_Tim
 * @description Add sandwich button to hide server list and server channels
 * @version 1.1.0
 */

module.exports = meta => {

  // default settings
  let settings = {
    "hide_servers_list": true,
    "hide_server_channels": true,
    "sandwich_button_color": '#cecece',
    "button": 'sandwich',
    "arrow_button_color": '#cecece',
    "arrow_button_background": '#1e1f22',
    "settings_text_color": '#f2f2f2'
  }

  let sandwich_button
  let arrow_button
  let sandwich_bars = []

  const maxLeft = 312
  let minLeft = 0
  
  function updateSettings() {
    loaded_settings = BdApi.Data.load(meta.name, "settings")
    if (loaded_settings) {
      settings = loaded_settings
    }
    minLeft = 0
    if(!settings.hide_servers_list) minLeft += 72
    if(!settings.hide_server_channels) minLeft += 240

    sandwich_bars.forEach(bar => {
      bar.style.backgroundColor = settings.sandwich_button_color
    });

    const arrow_button = document.querySelector('.retract_button')
    if (arrow_button) arrow_button.style.backgroundColor = settings.arrow_button_background
    
    const arrowStroke = document.querySelector('.retract_button svg > path')
    if (arrowStroke) arrowStroke.setAttribute('stroke', settings.arrow_button_color)

    if (sandwich_button && arrow_button) {
      if (settings.button == 'sandwich') {
        sandwich_button.style.display = ''
        arrow_button.style.display = 'none'
      } else {
        sandwich_button.style.display = 'none'
        arrow_button.style.display = 'flex'
      }
    }

    const input_settings = document.querySelectorAll('#sandwich-settings > div')
    if (input_settings) {
      input_settings.forEach(setting => setting.style.color = settings.settings_text_color)      
    }
    console.log('sandwich-settings-update')
  }

  return {
    start() {
      console.log('sandwich-start')
      updateSettings()

      const sidebar = document.querySelector('.sidebar-1tnWFu')
      const serverList = document.querySelector('.wrapper-1_HaEi')

      sidebar.classList.add('sandwich-toggle')
      serverList.classList.add('sandwich-toggle')

      sandwich_button = document.createElement('div')
      sandwich_button.classList.add('sandwich-button-container', 'sandwich-open')

      const common_bar_style = 'width: 35px; height: 5px; margin: 6px 0; transition: 0.4s;'

      const bar1 = document.createElement('div')
      bar1.classList.add('sandwich-button-bar1')
      sandwich_button.appendChild(bar1)
      bar1.style = common_bar_style

      const bar2 = document.createElement('div')
      bar2.classList.add('sandwich-button-bar2')
      sandwich_button.appendChild(bar2)
      bar2.style = common_bar_style

      const bar3 = document.createElement('div')
      bar3.classList.add('sandwich-button-bar3')
      sandwich_button.appendChild(bar3)
      bar3.style = common_bar_style

      sandwich_bars = [bar1, bar2, bar3]
      sandwich_bars.forEach(bar => {
        bar.style.backgroundColor = settings.sandwich_button_color
      })

      const root = document.getElementById("app-mount")
      root.appendChild(sandwich_button)
      sandwich_button.style = 'cursor: pointer; padding: 15px 20px; position: fixed; z-index: 1; top: 70px; left: ' + maxLeft + 'px'

      const retract_button = document.createElement('div');
      retract_button.classList.add('retract_button')
      sidebar.after(retract_button)

      const arrow_svg = '<svg width="18px" height="18px" viewBox="0 0 50 50" fill="none"><path d="M31 36L19 24L31 12" stroke="' + settings.arrow_button_color + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

      arrow_button = document.createElement('div')
      retract_button.appendChild(arrow_button)
      retract_button.style = 'cursor: pointer; align-items: center; width: 18px; background-color: ' + settings.arrow_button_background + ';'
      arrow_button.innerHTML = arrow_svg
      arrow_button.style = 'height: min-content; transition: 0.2s;'

      if (settings.button == 'sandwich') {
        sandwich_button.style.display = ''
        retract_button.style.display = 'none'
      } else {
        sandwich_button.style.display = 'none'
        retract_button.style.display = 'flex'
      }

      function arrowButtonTransform() {
        if (sandwich_button.classList.contains('sandwich-open')) {
          arrow_button.style.transform = 'rotate(0turn)'
        } else {
          arrow_button.style.transform = 'rotate(0.5turn)'
        }
      }

      sandwich_button.addEventListener("click", () => toggle_sandwich())
      retract_button.addEventListener("click", () => toggle_sandwich())

      function toggle_sandwich() {
        sandwich_button.classList.toggle('sandwich-open')
        sandwichButtonTransform()
        arrowButtonTransform()
        toggleSandwichToggle()
      }

      function sandwichButtonTransform() { // animates the sandwich button
        if (sandwich_button.classList.contains('sandwich-open')) {
          sandwich_bars.forEach(bar => {
            bar.style = common_bar_style
            bar.style.backgroundColor = settings.sandwich_button_color
          })
        } else {
          sandwich_bars[0].style = common_bar_style + ' transform: translate(0, 11px) rotate(-45deg);'
          sandwich_bars[1].style = common_bar_style + ' opacity: 0;'
          sandwich_bars[2].style = common_bar_style + ' transform: translate(0, -11px) rotate(45deg);'
          sandwich_bars.forEach(bar => {
            bar.style.backgroundColor = settings.sandwich_button_color
          })
        }
      }
    
      function toggleSandwichToggle() { // 
        if (sandwich_button.classList.contains('sandwich-open')) {
          sidebar.style.display = ''
          serverList.style.display = ''
          sandwich_button.style.left = maxLeft + 'px'
        } else {
          if (settings.hide_server_channels) sidebar.style.display = 'none'
          if (settings.hide_servers_list) serverList.style.display = 'none'
          sandwich_button.style.left = minLeft + 'px'
        }
      }
    },

    stop() {
      console.log('sandwich-stop')
      const sandwichClass = document.querySelectorAll('.sandwich-toggle')
      const sandwich_buttons = document.querySelectorAll('.sandwich-button-container')
      const retract_buttons = document.querySelectorAll('.retract_button')
      sandwichClass.forEach(element => {
        element.style.display = ''
      })
      sandwich_buttons.forEach(sandwich_button => {
        sandwich_button.remove()
      })
      retract_buttons.forEach(retract_button => {
        retract_button.remove()
      })
    },

    getSettingsPanel() {
      const settingsPanel = document.createElement("div")
      settingsPanel.id = "sandwich-settings"

      const sandwich_button = buildSetting("Sandwich button:", "button", "radio", 'sandwich')
      const arrow_button = buildSetting("Arrow button:", "button", "radio", 'arrow')

      const hide_servers_list = buildSetting("Hide servers list:", "hide_servers_list", "checkbox", settings.hide_servers_list)
      const hide_server_channels = buildSetting("Hide server channels:", "hide_server_channels", "checkbox", settings.hide_server_channels)
      const sandwich_button_color = buildSetting("Sandwich button color:", "sandwich_button_color", "text", settings.sandwich_button_color)

      const arrow_button_color = buildSetting("Arrow icon color:", "arrow_button_color", 'text', settings.arrow_button_color)
      const arrow_button_background = buildSetting("Arrow button background color:", "arrow_button_background", 'text', settings.arrow_button_background)
      const settings_text_color = buildSetting("Settings text color:", "settings_text_color", 'text', settings.settings_text_color)

      settingsPanel.append(sandwich_button, arrow_button, hide_servers_list, hide_server_channels, sandwich_button_color, arrow_button_color, arrow_button_background, settings_text_color)
      return settingsPanel

      function buildSetting(text, key, type, value) {
        const setting = Object.assign(document.createElement("div"), {className: "setting"})
        const label = Object.assign(document.createElement("label"), {textContent: text})
        const input = Object.assign(document.createElement("input"), {type: type, name:key, value: value})
        setting.style = 'margin: 5px 0; display: flex; align-items: center; color: ' + settings.settings_text_color
        label.style = 'flex: 3; display: flex; text-align: center;'
        input.style = 'flex: 1; text-align: center; max-width: 80px;'
        
        if (type == "checkbox" && value) input.checked = true
        if (type == "radio" && value == settings[key]) input.checked = true
        input.addEventListener("change", () => {
          const newValue = type == "checkbox" ? input.checked : input.value
          settings[key] = newValue
          BdApi.Data.save(meta.name, "settings", settings)
          updateSettings()
        })
        setting.append(label, input)
    
        return setting
      }
    }
  }
}



