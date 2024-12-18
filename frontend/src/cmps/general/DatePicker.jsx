
import { useState, useEffect, useCallback, useRef } from 'react'
import Select from '@atlaskit/select'

export function DatePicker({ initialStartDate, initialDueDate, initialDueTime, initialReminder, onClose, onDatesChange, onReset }) {
    const [startDate, setStartDate] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [dueTime, setDueTime] = useState('')
    const [reminderOption, setReminderOption] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [showStartDate, setShowStartDate] = useState(false)
    const [showDueDate, setShowDueDate] = useState(false)
    const [focusedInput, setFocusedInput] = useState('dueDate')

    const startDateInput = useRef()
    const dueDateInput = useRef()

    const reminderOptions = [
        { label: 'None', value: 'none' },
        { label: 'At time of due date', value: 'due' },
        { label: '5 minutes before', value: '5min' },
        { label: '10 minutes before', value: '10min' },
        { label: '15 minutes before', value: '15min' },
        { label: '1 hour before', value: '1hour' },
        { label: '2 hours before', value: '2hours' },
        { label: '1 day before', value: '1day' },
        { label: '2 days before', value: '2days' },
    ]

    const resetToInitialValues = useCallback(() => {
        if (initialStartDate) {
            setStartDate(initialStartDate)
            setShowStartDate(true)
        } else {
            setStartDate('')
            setShowStartDate(false)
        }

        if (initialDueDate) {
            setDueDate(initialDueDate)
            setShowDueDate(true)
        } else if (!initialStartDate) {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            setDueDate(formatDateLocal(tomorrow))
            setDueTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })) // Now
            setShowDueDate(true)
        }

        setDueTime(initialDueTime || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))

        const savedReminderOption = reminderOptions.find(option => option.value === initialReminder) || reminderOptions[0]
        setReminderOption(savedReminderOption)
    }, [initialStartDate, initialDueDate, initialDueTime, initialReminder])

    useEffect(() => {
        resetToInitialValues()
    }, [resetToInitialValues])

    useEffect(() => {
        requestAnimationFrame(() => {
            const input = focusedInput === 'dueDate' ? dueDateInput.current : startDateInput.current
            if (input) input.focus()
        })
    }, [focusedInput])

    useEffect(() => {
        setFocusedInput(initialDueDate ? 'Date' : 'startDate')
    }, [])

    function isDateInRange(date) {
        const start = parseDate(startDate)
        const end = parseDate(dueDate)

        if (!startDate) return +date === +end
        if (!dueDate) return +date === +start
        return date >= start && date <= end
    }

    function renderCalendar() {
        const days = []
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        // Get the first day of the current month
        const firstDayOfMonth = new Date(year, month, 1).getDay()

        // Get the last day of the previous month
        const lastDayOfPrevMonth = new Date(year, month, 0).getDate()

        // Get the number of days in the current month
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Calculate the number of days we need from the previous month
        const daysFromPrevMonth = firstDayOfMonth

        // Calculate the number of days we need from the next month
        const totalDays = 35 // 5 weeks * 7 days
        const daysFromNextMonth = totalDays - daysFromPrevMonth - daysInMonth

        // Add days from the previous month
        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, lastDayOfPrevMonth - i)
            days.push(renderDay(date, 'prev-month'))
        }

        // Add days from the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i)
            days.push(renderDay(date, 'current-month'))
        }

        // Add days from the next month
        for (let i = 1; i <= daysFromNextMonth; i++) {
            const date = new Date(year, month + 1, i)
            days.push(renderDay(date, 'next-month'))
        }

        return days
    }

    function renderDay(date, monthClass) {
        const formattedDate = formatDateLocal(date)
        const isInRange = isDateInRange(date)
        const isStart = startDate === formattedDate
        const isEnd = dueDate === formattedDate
        const isToday = date.toDateString() === new Date().toDateString()

        let className = `calendar-day ${monthClass}`
        if (isInRange) className += " in-range"
        if (isStart || isEnd) className += " range-end"
        if (isToday) className += " today"

        return (
            <button
                key={formattedDate}
                className={className}
                onClick={() => handleDateClick(date)}
            >
                {date.getDate()}
            </button>
        )
    }

    function changeMonth(increment) {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1))
    }

    function formatDateLocal(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    function parseDate(dateString) {
        if (!dateString) return ''
        const [year, month, day] = dateString.split('-')
        return new Date(year, month - 1, day)
    }

    const handleDateClick = useCallback((date) => {
        if (date === undefined || !date) return

        const formattedDate = formatDateLocal(date)

        if (showStartDate && focusedInput === 'startDate') {
            setStartDate(formattedDate)
            if (showDueDate && (!dueDate || new Date(dueDate) < new Date(formattedDate))) {
                const newDueDate = new Date(formattedDate)
                newDueDate.setDate(newDueDate.getDate() + 1)
                setDueDate(formatDateLocal(newDueDate))
            }
        } else if (showDueDate) {
            setDueDate(formattedDate)
            if (showStartDate && (!startDate || new Date(startDate) > new Date(formattedDate))) {
                const newStartDate = new Date(formattedDate)
                newStartDate.setDate(newStartDate.getDate() - 1)
                setStartDate(formatDateLocal(newStartDate))
            }
        }
    }, [startDate, dueDate, focusedInput, showStartDate, showDueDate])

    function handleSaveDates() {
        onDatesChange({
            startDate: showStartDate ? startDate : '',
            dueDate: showDueDate ? dueDate : '',
            dueTime: showDueDate ? dueTime : '',
            reminder: reminderOption?.value || ''
        })
        onClose()
    }

    function handleRemoveDates() {
        onDatesChange({ startDate: '', dueDate: '', dueTime: '', reminder: '' })
        onClose()
    }

    function handleInputChange(e, setDateFunction) {
        const inputValue = e.target.value
        setDateFunction(inputValue)

        // Update the calendar view when the date is changed
        if (inputValue) {
            const [year, month, day] = inputValue.split('-')
            setCurrentMonth(new Date(year, month - 1, 1))
        }
    }

    function getDefaultStartDate() {
        if (dueDate) {
            const newStartDate = new Date(dueDate)
            newStartDate.setDate(newStartDate.getDate() - 1)
            return formatDateLocal(newStartDate)
        }
        return formatDateLocal(new Date())
    }

    function getDefaultDueDate() {
        if (startDate) {
            const newDueDate = new Date(startDate)
            newDueDate.setDate(newDueDate.getDate() + 1)
            return formatDateLocal(newDueDate)
        }
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return formatDateLocal(tomorrow)
    }

    return (
        <div className="date-picker">
            <section className="calendar-container">
                <div className="month-selector">
                    <button className="btn" onClick={() => changeMonth(-1)}>
                        <span className="icon icon-sm icon-back" />
                    </button>
                    <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button className="btn" onClick={() => changeMonth(1)}>
                        <span className="icon icon-sm icon-forward" />
                    </button>
                </div>
                <div className="calendar">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="calendar-day day-name">{day}</div>
                    ))}
                    {renderCalendar()}
                </div>
            </section>
            <section className={`start-date input-date ${showStartDate ? '' : 'disabled'}`}>
                <h4 className="input-date-title">Start date</h4>
                <div className="input-date-checkbox">
                    <input
                        type="checkbox"
                        id="startDateCheckbox"
                        checked={showStartDate}
                        onChange={(ev) => {
                            setShowStartDate(ev.target.checked)
                            if (ev.target.checked) {
                                setFocusedInput('startDate')
                                setStartDate(getDefaultStartDate())
                            } else {
                                setStartDate('')
                                setFocusedInput('dueDate')
                            }
                        }}
                    />
                </div>
                <div className={`input-date-input`}>
                    <input
                        ref={startDateInput}
                        type="date"
                        value={startDate}
                        onChange={(ev) => handleInputChange(ev, setStartDate)}
                        onFocus={() => setFocusedInput('startDate')}
                        disabled={!showStartDate}
                    />
                </div>
            </section>
            <section className={`due-date input-date ${showDueDate ? '' : 'disabled'}`}>
                <h4 className="input-date-title">Due date</h4>
                <div className="input-date-checkbox">
                    <input
                        type="checkbox"
                        id="dueDateCheckbox"
                        checked={showDueDate}
                        onChange={(ev) => {
                            setShowDueDate(ev.target.checked)
                            if (ev.target.checked) {
                                setFocusedInput('dueDate')
                                setDueDate(getDefaultDueDate())
                                setDueTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
                            } else {
                                setDueDate('')
                                setDueTime('')
                                setFocusedInput('startDate')
                            }
                        }}
                    />
                </div>
                <div className={`input-date-input`}>
                    <input
                        ref={dueDateInput}
                        type="date"
                        value={dueDate}
                        onChange={(ev) => handleInputChange(ev, setDueDate)}
                        onFocus={() => setFocusedInput('dueDate')}
                        disabled={!showDueDate}
                    />
                </div>
                {showDueDate && (
                    <div className='time-input'>
                        <input
                            type="time"
                            value={dueTime}
                            onChange={(ev) => setDueTime(ev.target.value)}
                        />
                    </div>
                )}
            </section>
            <section className="reminder">
                <h4>Set due date reminder</h4>
                <Select
                    inputId="reminder-select"
                    className="reminder-select"
                    classNamePrefix="date-picker"
                    onChange={(option) => setReminderOption(option)}
                    value={reminderOption}
                    options={reminderOptions}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                />
                <p>Reminders will be sent to all members and watchers of this card.</p>
            </section>
            <section className='btn-container'>
                <button className="btn btn-color-bold blue" onClick={handleSaveDates}>Save</button>
                <button className="btn btn-light" onClick={handleRemoveDates}>Remove</button>
            </section>
        </div>
    )
}
