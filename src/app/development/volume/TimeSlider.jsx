import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ResponsiveXYFrame } from 'semiotic';
import moment from 'moment';
import { timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';
import { format, isValid, parse, getYear } from 'date-fns';
import ErrorBoundary from '../../../shared/ErrorBoundary';

function TimeSlider({
  defaultBrushExtent = [
    timeWeek.offset(timeDay.floor(new Date()), -1).getTime(),
    timeDay.floor(new Date()).getTime(),
  ],
  spanLowerLimit = timeDay.floor(new Date(Date.UTC(1999, 0, 1))).getTime(),
  spanUpperLimit = timeDay.floor(new Date()).getTime(),
  spanEnd = timeDay.floor(new Date()).getTime(),
  maxDaysAllowedToQuery = 730,
  onBrushEnd = (newExtent) => {
    console.log(newExtent);
  },
  xSpan: xSpanYears = 2,
  tickMeasure = 'month',
  minimumTickWidth = 25,
  initialTickGap = 1,
}) {
  const defaultMessage = useMemo(() => {
    return `Set a date range between
      ${moment.utc(spanLowerLimit).format('MMM DD, YYYY')} and
      ${moment.utc(spanUpperLimit).format('MMM DD, YYYY')}. Maximum range for a single query is
      ${maxDaysAllowedToQuery} days. Dates must be in the format MM/DD/YYYY.`;
  }, [spanLowerLimit, spanUpperLimit, maxDaysAllowedToQuery]);

  const defaultMessageColor = '#222';
  const errorMessageColor = '#b00020';

  // const today = useMemo(() => {
  //   return timeDay.floor(new Date()).getTime();
  // }, []);

  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

  const [brushExtent, setBrushExtent] = useState(defaultBrushExtent);

  const [firstInputValue, setFirstInputValue] = useState(
    format(new Date(parseInt(defaultBrushExtent[0])), 'MM/dd/yyyy'),
  );
  const [secondInputValue, setSecondInputValue] = useState(
    format(new Date(parseInt(defaultBrushExtent[1])), 'MM/dd/yyyy'),
  );

  const [selectedTimespan, setSelectedTimespan] = useState(0);
  const [xSpan, setXSpan] = useState([
    timeYear.offset(spanEnd, -1 * xSpanYears).getTime(),
    spanEnd,
  ]);
  const [initialParamsChecked, setInitialParamsChecked] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(window.innerWidth);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState(defaultMessageColor);

  const buttonDisabled = useMemo(() => {
    const firstParsed = parse(firstInputValue, 'MM/dd/yyyy', new Date());
    const secondParsed = parse(secondInputValue, 'MM/dd/yyyy', new Date());

    if (firstParsed.getTime() === brushExtent[0] && secondParsed.getTime() === brushExtent[1]) {
      return true;
    }

    if (!Number.isInteger(brushExtent[0]) || !Number.isInteger(brushExtent[1])) {
      return true;
    }

    return false;
  }, [firstInputValue, secondInputValue, brushExtent]);

  const determineNewExtent = useCallback(
    (proposedExtent, snap = false) => {
      let newExtent = proposedExtent;
      let newSpan = xSpan;
      let message = '';
      let messageColor = defaultMessageColor;

      if (proposedExtent) {
        // When brushing stops (brushEnd invokes with snap=true), snap to "whole time" (drop the decimal part, use floor func so it doesn't round up to "tomorrow")
        if (snap) {
          const timeFunc = timeDay;
          newExtent = [
            timeFunc.floor(proposedExtent[0]).getTime(),
            timeFunc.floor(proposedExtent[1]).getTime(),
          ];
        }

        let selectedRange = timeDay.count(newExtent[0], newExtent[1]);
        let spanRange = timeDay.count(xSpan[0], xSpan[1]);
        let rangeDiff = spanRange - selectedRange;
        let newExtentHuman = `${moment.utc(newExtent[0]).format('MMM DD, YYYY')} - ${moment.utc(newExtent[1]).format('MMM DD, YYYY')}`;

        // measure the amount of available valid date range input (in days) after selected end date and before selected start date
        let rangeOverhead = timeDay.count(newExtent[1], parseInt(spanUpperLimit));
        let rangeUnderhead = timeDay.count(spanLowerLimit, newExtent[0]);

        // if either value is negative, then input is out of range; revert to default values
        if (rangeOverhead < 0 || rangeUnderhead < 0) {
          message = `${newExtentHuman} is invalid.`;

          if (rangeOverhead < 0) {
            if (endDateInputRef.current) {
              endDateInputRef.current.focus();
            }
          } else if (rangeUnderhead < 0) {
            if (startDateInputRef.current) {
              startDateInputRef.current.focus();
            }
          }

          messageColor = errorMessageColor;

          return {
            extent: brushExtent,
            span: newSpan,
            message: message,
            messageColor: messageColor,
          };
        }

        // Don't allow ranges bigger or smaller than allowed (i.e. negative), just reset to "last good" value
        if (
          (+selectedRange > +maxDaysAllowedToQuery || +newExtent[0] >= +newExtent[1]) &&
          selectedRange !== 0
        ) {
          message = `The range ${newExtentHuman} is ${selectedRange < 0 ? 'invalid' : 'too big (' + selectedRange + ' days)'}.`;
          messageColor = errorMessageColor;
          newExtent = brushExtent;

          if (startDateInputRef.current) {
            startDateInputRef.current.focus();
          }

          // no need to change the existing span
        }

        // Don't allow dates before or after defined limits
        else if (+newExtent[0] < +spanLowerLimit || +newExtent[1] > +spanUpperLimit) {
          message = `One or both of the dates (${newExtentHuman}) are outside the allowed range.`;
          messageColor = errorMessageColor;
          newExtent = brushExtent;

          if (+newExtent[0] < +spanLowerLimit) {
            if (startDateInputRef.current) {
              startDateInputRef.current.focus();
            }
          } else if (+newExtent[1] > +spanUpperLimit) {
            if (endDateInputRef.current) {
              endDateInputRef.current.focus();
            }
          }

          // no need to change the existing span
        }

        // Don't allow date ranges starting before AND ending after the current span (i.e. longer than the span)
        // Set the start and end dates to match the start and end of the span
        // NOTE: if maxDaysAllowedToQuery >= xSpan, this condition will never happen (the first condition will fire instead)
        else if (+newExtent[0] < +xSpan[0] && +newExtent[1] > +xSpan[1]) {
          message = `Date range too big or small..`;
          messageColor = errorMessageColor;
          newExtent = brushExtent;

          if (startDateInputRef.current) {
            startDateInputRef.current.focus();
          }

          // no need to change the existing span
        }

        // If only the end date is outside span limit
        else if (+newExtent[0] > +xSpan[0] && +newExtent[1] > +xSpan[1]) {
          message = `${moment.utc(newExtent[1]).format('MMM DD, YYYY')} is outside the allowed range.`;
          messageColor = errorMessageColor;

          if (endDateInputRef.current) {
            endDateInputRef.current.focus();
          }

          if (+newExtent[1] > +spanUpperLimit) {
            newExtent[1] = spanUpperLimit;
            newSpan = [timeYear.offset(spanUpperLimit, -1 * xSpanYears).getTime(), spanUpperLimit];
          } else {
            if (rangeDiff / 2 <= rangeOverhead) {
              newSpan = [
                timeDay.offset(newExtent[0], -1 * (rangeDiff / 2)).getTime(),
                timeDay.offset(newExtent[1], rangeDiff / 2).getTime(),
              ];
            } else {
              newSpan = [
                timeDay.offset(newExtent[0], -1 * (rangeDiff - rangeOverhead)).getTime(),
                timeDay.offset(newExtent[1], rangeOverhead).getTime(),
              ];
            }
          }
        }

        // If only the start date is outside span limit
        else if (+newExtent[0] < +xSpan[0] && +newExtent[1] < +xSpan[1]) {
          if (startDateInputRef.current) {
            startDateInputRef.current.focus();
          }

          if (+newExtent[0] < +spanLowerLimit) {
            message = `The start date is outside the allowed range.`;
            messageColor = errorMessageColor;

            newExtent[0] = spanLowerLimit;
            newSpan = [spanLowerLimit, timeYear.offset(spanLowerLimit, xSpanYears).getTime()];
          } else {
            if (rangeDiff / 2 <= rangeUnderhead) {
              newSpan = [
                timeDay.offset(newExtent[0], -1 * (rangeDiff / 2)).getTime(),
                timeDay.offset(newExtent[1], rangeDiff / 2).getTime(),
              ];
            } else {
              newSpan = [
                timeDay.offset(newExtent[0], -1 * rangeUnderhead).getTime(),
                timeDay.offset(newExtent[1], rangeDiff - rangeUnderhead).getTime(),
              ];
            }
          }
        }
      } else {
        newExtent = brushExtent;
      }

      return {
        extent: newExtent,
        span: newSpan,
        message: message,
        messageColor: messageColor,
      };
    },
    [
      xSpan,
      brushExtent,
      spanUpperLimit,
      spanLowerLimit,
      maxDaysAllowedToQuery,
      xSpanYears,
      defaultMessageColor,
      errorMessageColor,
    ],
  );

  const brushDuring = useCallback(
    (proposedExtent) => {
      const newRanges = determineNewExtent(proposedExtent, false);
      setBrushExtent(newRanges.extent);
      setFirstInputValue(format(new Date(parseInt(newRanges.extent[0])), 'MM/dd/yyyy'));
      setSecondInputValue(format(new Date(parseInt(newRanges.extent[1])), 'MM/dd/yyyy'));
    },
    [determineNewExtent],
  );

  const brushEnd = useCallback(
    (proposedExtent, snap = true) => {
      const newRanges = determineNewExtent(proposedExtent, snap);
      let selectedRange = timeDay.count(newRanges.extent[0], newRanges.extent[1]);

      onBrushEnd(newRanges.extent);
      setBrushExtent(newRanges.extent);
      setFirstInputValue(format(new Date(parseInt(newRanges.extent[0])), 'MM/dd/yyyy'));
      setSecondInputValue(format(new Date(parseInt(newRanges.extent[1])), 'MM/dd/yyyy'));
      setXSpan(newRanges.span);
      setSelectedTimespan(selectedRange);
      setMessage(newRanges.message);
      setMessageColor(newRanges.messageColor);
    },
    [determineNewExtent, onBrushEnd],
  );

  const handleTimespanSelection = useCallback(
    (daySpan, requestedRange = 'today') => {
      // check if calculation should be relative to the current span or the current end date
      let relativeDate;
      let proposedExtent;

      if (+daySpan === 0) {
        setSelectedTimespan(0);
        return;
      } else {
        if (requestedRange === 'forward') {
          let daysOverhead = timeDay.count(brushExtent[1], spanUpperLimit);
          let daySpanToUse = daysOverhead < selectedTimespan ? daysOverhead : daySpan;
          relativeDate = brushExtent[1];
          proposedExtent = [relativeDate, timeDay.offset(relativeDate, 1 * daySpanToUse).getTime()];
        } else if (requestedRange === 'backward') {
          let daysUnderhead = timeDay.count(spanLowerLimit, brushExtent[0]);
          let daySpanToUse = daysUnderhead < selectedTimespan ? daysUnderhead : daySpan;
          relativeDate = brushExtent[0];
          proposedExtent = [
            timeDay.offset(relativeDate, -1 * daySpanToUse).getTime(),
            relativeDate,
          ];
        } else {
          // count back from end of available span
          relativeDate = spanUpperLimit;
          proposedExtent = [timeDay.offset(relativeDate, -1 * daySpan).getTime(), relativeDate];
        }
        const newRanges = determineNewExtent(proposedExtent, true);
        setBrushExtent(newRanges.extent);
        setFirstInputValue(format(new Date(parseInt(newRanges.extent[0])), 'MM/dd/yyyy'));
        setSecondInputValue(format(new Date(parseInt(newRanges.extent[1])), 'MM/dd/yyyy'));
        setXSpan(newRanges.span);
        setSelectedTimespan(daySpan);
        setMessage(newRanges.message);
        setMessageColor(newRanges.messageColor);
      }
    },
    [brushExtent, selectedTimespan, spanUpperLimit, spanLowerLimit, determineNewExtent],
  );

  const trimAndSetFirst = useCallback((e) => {
    const input = e.target.value.trim();
    setFirstInputValue(input);
  }, []);

  const trimAndSetSecond = useCallback((e) => {
    const input = e.target.value.trim();
    setSecondInputValue(input);
  }, []);

  const validateAndSubmitDates = useCallback(() => {
    const firstParsedDate = parse(firstInputValue, 'MM/dd/yyyy', new Date());
    const secondParsedDate = parse(secondInputValue, 'MM/dd/yyyy', new Date());

    const isFirstValid = isValid(firstParsedDate) && getYear(firstParsedDate) >= 1000;
    const isSecondValid = isValid(secondParsedDate) && getYear(secondParsedDate) >= 1000;

    let dateValid = true;
    let validationMessage = '';

    if (!isFirstValid || firstInputValue.length < 10) {
      validationMessage += 'Start date is invalid. ';
      dateValid = false;
      if (startDateInputRef.current) {
        startDateInputRef.current.focus();
      }
    }

    if (!isSecondValid || secondInputValue.length < 10) {
      validationMessage += 'End date is invalid. ';
      dateValid = false;
      if (!validationMessage.includes('Start') && endDateInputRef.current) {
        endDateInputRef.current.focus();
      }
    }

    if (!dateValid) {
      setMessageColor(errorMessageColor);
      setMessage(validationMessage + 'Dates must be in the format MM/DD/YYYY.');
      return false;
    }

    const newFromDate = firstParsedDate.getTime();
    const throughDate = secondParsedDate.getTime();

    if (newFromDate > throughDate) {
      setMessageColor(errorMessageColor);
      setMessage('Start date must be before the end date.');
      if (startDateInputRef.current) {
        startDateInputRef.current.focus();
      }
      return false;
    }

    setMessageColor(defaultMessageColor);
    setMessage('');
    brushEnd([newFromDate, throughDate], true);
    return true;
  }, [firstInputValue, secondInputValue, brushEnd, errorMessageColor, defaultMessageColor]);

  const handleSubmit = useCallback(
    (e = false) => {
      if (e) {
        e.preventDefault();
      }
      validateAndSubmitDates();
    },
    [validateAndSubmitDates],
  );

  const updateWindowWidth = useCallback(() => {
    const timelineContainer = document.getElementById('timeline-container');

    if (timelineContainer) {
      setSliderWidth(timelineContainer.offsetWidth);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateWindowWidth);
    updateWindowWidth();

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, [updateWindowWidth]);

  useEffect(() => {
    if (!initialParamsChecked) {
      const initialParams = determineNewExtent(defaultBrushExtent, false);
      setBrushExtent(initialParams.extent);
      setFirstInputValue(format(new Date(parseInt(initialParams.extent[0])), 'MM/dd/yyyy'));
      setSecondInputValue(format(new Date(parseInt(initialParams.extent[1])), 'MM/dd/yyyy'));
      setXSpan(initialParams.span);
      setInitialParamsChecked(true);
    }
  }, [initialParamsChecked, defaultBrushExtent, determineNewExtent]);

  const { ticks, tickFormat } = useMemo(() => {
    let timeFunc = timeYear;
    if (tickMeasure === 'month') {
      timeFunc = timeMonth;
    } else if (tickMeasure === 'week') {
      timeFunc = timeWeek;
    }
    let tickGap = initialTickGap;
    let ticks = timeFunc.range(timeFunc.ceil(xSpan[0]), timeFunc.ceil(xSpan[1]), tickGap);

    let tickCount = ticks.length;

    // Figure out how many pixels each tick mark would get
    let tickRatio = sliderWidth / tickCount;

    // if each tick mark lacks adequate pixel width, we'll increase the tick interval (tickGap)
    if (tickRatio < minimumTickWidth) {
      // If we double the current tick interval, we'll halve the number of tick marks in our tick array
      let newTickCount = tickCount / 2;
      let newTickRatio = sliderWidth / newTickCount;
      tickGap++;

      // Figure out which tick interval would yield an adequate gap betweek tick marks, then rebuild the tick array using the new gap
      while (newTickRatio < minimumTickWidth) {
        newTickCount = newTickCount / 2;
        newTickRatio = sliderWidth / newTickCount;
        tickGap++;
      }

      ticks = timeFunc.range(timeFunc.ceil(xSpan[0]), timeFunc.ceil(xSpan[1]), tickGap);
    }

    let tickFormat = 'yyyy';
    if (tickMeasure === 'month') {
      tickFormat = 'MMM yyyy';
    } else if (tickMeasure === 'week') {
      tickFormat = 'MMM dd';
    }

    return { ticks, tickFormat };
  }, [tickMeasure, xSpan, sliderWidth, minimumTickWidth, initialTickGap]);

  return (
    <div className="w-full my-6">
      <ErrorBoundary>
        <div>
          <div
            id="form_feedback_message"
            name="Date range guidance"
            className="small ml-0 pl-2 mr-2 mb-4"
            style={{
              borderLeft: `1px solid ${messageColor}`,
              color: messageColor,
            }}
          >
            <span aria-live="polite">{message.trim() ? `${message} ${defaultMessage}` : ''}</span>
            {message.trim() ? '' : defaultMessage}
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2 px-2"
            aria-label="Provide a date range"
          >
            <fieldset>
              <legend className="sr-only">Manually adjust the existing date range</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2">
                <div className="grow flex items-center">
                  <label htmlFor="startdate" style={{ marginBottom: '0', padding: '0 0.25em 0 0' }}>
                    From
                  </label>
                  <input
                    type="text"
                    id="startdate"
                    ref={startDateInputRef}
                    name="startdate"
                    className="input lg:input-sm grow"
                    aria-describedby="form_feedback_message"
                    placeholder="MM/DD/YYYY"
                    value={firstInputValue}
                    onChange={trimAndSetFirst}
                  />
                </div>
                <div className="grow flex items-center">
                  <label htmlFor="enddate" style={{ marginBottom: '0', padding: '0 0.25em 0 0' }}>
                    Through
                  </label>
                  <input
                    type="text"
                    id="enddate"
                    ref={endDateInputRef}
                    name="enddate"
                    className="input lg:input-sm grow"
                    aria-describedby="form_feedback_message"
                    placeholder="MM/DD/YYYY"
                    value={secondInputValue}
                    onChange={trimAndSetSecond}
                  />
                </div>
              </div>
            </fieldset>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2">
              <input
                type="submit"
                value="Set Dates"
                title="Set the date range to the values in the input fields."
                className="btn btn-primary lg:btn-sm grow"
                disabled={buttonDisabled}
              />
              <div className="flex-1">
                <fieldset className="flex w-full">
                  <legend className="sr-only">Choose a preset timespan</legend>
                  <button
                    type="button"
                    className="btn btn-primary lg:btn-sm rounded-tr-none rounded-br-none"
                    disabled={timeDay.count(spanLowerLimit, brushExtent[0]) === 0}
                    title="Move current timespan earlier"
                    onClick={() => {
                      const currentTimespan = selectedTimespan;
                      handleTimespanSelection(currentTimespan, 'backward');
                    }}
                  >
                    <i className="bi bi-caret-left" aria-hidden="true"></i>
                    <span className="sr-only">Move current timespan earlier</span>
                  </button>
                  <div className="grow">
                    <label className="sr-only" htmlFor="timespan_select">
                      Choose a preset timespan
                    </label>
                    <select
                      id="timespan_select"
                      value={brushExtent[1] === spanUpperLimit ? selectedTimespan : 0}
                      className="w-full h-[42px] lg:h-[30px] form-control input-sm px-4 bg-white"
                      style={{
                        borderColor: '#ccc',
                        borderWidth: 'revert',
                        borderRadius: 'revert',
                      }}
                      onChange={(e) => {
                        handleTimespanSelection(e.currentTarget.value);
                      }}
                    >
                      <option value={0}>Choose timespan</option>
                      {[
                        { days: 30, label: 'month' },
                        { days: 90, label: '3 months' },
                        { days: 180, label: '6 months' },
                        { days: 365, label: 'year' },
                        { days: 730, label: '2 years' },
                        { days: 1825, label: '5 years' },
                      ]
                        .filter((timeSpan) => {
                          return timeSpan.days <= maxDaysAllowedToQuery;
                        })
                        .map((timeSpan, i) => {
                          return (
                            <option key={['timespan', 'option', i].join('_')} value={timeSpan.days}>
                              {`Last ${timeSpan.label}`}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary lg:btn-sm rounded-tl-none rounded-bl-none"
                    disabled={timeDay.count(brushExtent[1], spanUpperLimit) === 0}
                    title="Move current timespan later"
                    onClick={() => {
                      const currentTimespan = selectedTimespan;
                      handleTimespanSelection(currentTimespan, 'forward');
                    }}
                  >
                    <i className="bi bi-caret-right" aria-hidden="true"></i>
                    <span className="sr-only">Move current timespan later</span>
                  </button>
                </fieldset>
              </div>
            </div>
          </form>
        </div>
        <div className="brushedChart" id="timeline-container" aria-hidden="true">
          <ResponsiveXYFrame
            responsiveWidth
            margin={{
              top: 20,
              right: 10,
              bottom: 50,
              left: 25,
            }}
            size={[1000, 75]}
            xAccessor={(d) => {
              return d;
            }}
            yAccessor={() => {
              return 0;
            }}
            xExtent={xSpan}
            axes={[
              {
                orient: 'bottom',
                tickFormat: (d) => {
                  return (
                    <text
                      textAnchor="middle"
                      style={{ fontSize: '0.70em', left: '-14px' }}
                      transform="rotate(-45)"
                    >
                      {moment.utc(d).format(tickFormat)}
                    </text>
                  );
                },
                tickValues: ticks,
              },
            ]}
            interaction={{
              during: brushDuring,
              end: brushEnd,
              brush: 'xBrush',
              extent: brushExtent,
            }}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default TimeSlider;
