class Period {

  /**
   * Class for representing a period in a day
   * @constructor
   * @param {string} period - The period's letter
   * @param {number} start - Time when the period starts in minutes since 00:00 of the day.
   * @param {number} end - Time when the period ends in minutes since 00:00 of the day.
   * @param {boolean} today - If the period is representing a period today.
   */
  constructor(period, start, end, today) {
    this.period = period = period.toUpperCase();
    this.startTime = start;
    this.endTime = end;
    this.wrapper = createElement('div', {
      classes: ['period'],
      data: {
        period: period.length === 1 && period
      },
      ripple: true,
      content: [
        this.name = createElement('textarea', {
          classes: 'name',
          value: Prefs.getPdName(period)
        }),
        this.timeRange = createElement('span', {content: Formatter.time(start) + '–' + Formatter.time(end)}),
        today && (this.toStart = createElement('span', {})),
        today && (this.toEnd = createElement('span', {})),
        this.duration = createElement('span', {
          content: Formatter.phrase(
            'lasts',
            Formatter.duration(end - start)
          )
        }),
        this.note = createElement('textarea', {
          classes: 'note',
          value: Prefs.getPdDesc(period)
        })
      ]
    });
    this.spans = [this.timeRange, this.toStart, this.toEnd, this.duration].filter(a => a);
    Period.setColourOf(this.wrapper, Prefs.getPdColour(period));
    if (!today) {
      this.timeRange.classList.add('previewed');
    }

    this.name.addEventListener('keydown', e => {
      if (e.keyCode === 13) e.preventDefault();
    })
    this.name.addEventListener('input', e => {
      if (this.name.value.includes('\n'))
        this.name.value = this.name.value.replace(/\r?\n/g, '');
      dynamicTextareaFitter(e);
    });
    this.note.addEventListener('input', dynamicTextareaFitter);
  }

  /**
   * Sets the displayed "time left" thingy of the period.
   * @param {number} minutes - Current number of minutes since the begining of the day.
   */
  setTime(minutes) {
    /*
     * examples:
     * before period  -  50, 100 "starting in 50 minutes"
     * period starts  -   0,  50 "ending in 50 minutes"
     * period partway - -20,  30 "ending in 30 minutes"
     * period ends    - -50,   0 "just ended"
     * after period   - -70, -20 "ended 20 minutes ago"
     */

    let timeToStart = this.startTime - minutes;
    this.toStart.innerHTML = Formatter.phrase(
      timeToStart === 0 ? 'juststarted' : timeToStart < 0 ? 'started' : 'starting',
      `<em>${Math.abs(timeToStart)}</em>`
    );

    let timeToEnd = this.endTime - minutes;
    this.toEnd.innerHTML = Formatter.phrase(
      timeToEnd === 0 ? 'justended' : timeToEnd < 0 ? 'ended' : 'ending',
      `<em>${Math.abs(timeToEnd)}</em>`
    );

    if (timeToStart > 0) {
      this.toStart.classList.add('previewed');
      this.toEnd.classList.remove('previewed');
    } else {
      this.toStart.classList.remove('previewed');
      this.toEnd.classList.add('previewed');
    }
  }

  /**
   * Sets the custom name of the period.
   */
  updateCustomisation() {
    this.name.value = Prefs.getPdName(this.period);
    this.note.value = Prefs.getPdDesc(this.period);
    Period.setColourOf(this.wrapper, Prefs.getPdColour(this.period));
  }

  /**
   * Expands the period card.
   */
  expand() {
    if (this.wrapper.classList.contains('open')) return;
    this.wrapper.classList.add('open');
    this.spans.forEach(span => {
      span.style.height = span.scrollHeight + 'px';
    });
    this.note.style.height = 0;
    this.note.style.height = this.note.scrollHeight + 'px';
  }

  /**
   * Collapses the period card.
   */
  collapse() {
    this.wrapper.classList.remove('open');
    this.spans.forEach(span => {
      span.style.height = null;
    });
    this.note.style.height = null;
  }

  /**
   * Prepares the width of the period name
   */
  initialize() {
    this.name.style.height = 0;
    this.name.style.height = this.name.scrollHeight + 2 + 'px';
  }

  static setColourOf(element, colour) {
    if (typeof colour === 'string') {
      element.style.backgroundColor = colour;
      element.classList.remove('clear');
    } else {
      element.style.backgroundColor = null;
      element.classList.add('clear');
    }
  }

}
