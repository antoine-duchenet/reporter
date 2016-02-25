'use strict';

const Observer = require('../../observer').Observer;

class Reporter extends Observer {
    constructor() {
        super();
        this.data = {};
    }

    text(label, events, options) {
        const identifier = options && options.identifier ? options.identifier : label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        events.forEach((event) => {
            const _event = event.split('@')[0];
            const _property = event.split('@')[1];
            this.on(_event, (data) => {
                this.data[identifier] = this.data[identifier] || { label, type: 'text' };
                this.data[identifier].data = this.data[identifier].data || [];
                this.data[identifier].data.push((_property ? data[_property] : data) || '');
            });
        });
    }

    timer(label, start, end, options) {
        const identifier = options && options.identifier ? options.identifier : label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        this.on(start, () => {
            this.data[identifier] = this.data[identifier] || { label, type: 'timer' };
            this.data[identifier].data = this.data[identifier].data || {};
            this.data[identifier].data.start = Date.now();
        });
        this.on(end, () => {
            this.data[identifier] = this.data[identifier] || { label, type: 'timer' };
            this.data[identifier].data = this.data[identifier].data || {};
            this.data[identifier].data.end = Date.now();
        });
    }

    timeline(label, sections, options) {
        const identifier = options && options.identifier ? options.identifier : label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        sections.forEach((section) => {
            const sectionOptions = section.options;
            const sectionLabel = section.label;
            const sectionStart = section.start;
            const sectionEnd = section.end;
            const sectionIdentifier = sectionOptions && sectionOptions.identifier ? sectionOptions.identifier : sectionLabel.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');

            this.on(sectionStart, () => {
                this.data[identifier] = this.data[identifier] || { label, type: 'timeline' };
                this.data[identifier].data = this.data[identifier].data || {};
                this.data[identifier].data[sectionIdentifier] = this.data[identifier].data[sectionIdentifier] || {};
                this.data[identifier].data[sectionIdentifier].start = Date.now();
            });

            this.on(sectionEnd, () => {
                this.data[identifier] = this.data[identifier] || { label, type: 'timeline' };
                this.data[identifier].data = this.data[identifier].data || {};
                this.data[identifier].data[sectionIdentifier] = this.data[identifier].data[sectionIdentifier] || {};
                this.data[identifier].data[sectionIdentifier].end = Date.now();
            });
        });
    }

    distribution(label, sections, options) {
        const identifier = options && options.identifier ? options.identifier : label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        for (const section in sections) {
            if (sections.hasOwnProperty(section)) {
                const events = sections[section];
                events.forEach((event) => {
                    const _event = event.split('@')[0];
                    const _property = event.split('@')[1] || null;
                    this.on(_event, (data) => {
                        this.data[identifier] = this.data[identifier] || { label, type: 'distribution' };
                        this.data[identifier].data = this.data[identifier].data || {};
                        this.data[identifier].data[section] = this.data[identifier].data[section] || 0;
                        this.data[identifier].data[section] += _property && data ? data[_property] : 1;
                    });
                });
            }
        }
    }
}

module.exports = Reporter;
