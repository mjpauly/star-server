import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { IconButton, Paper, Typography } from '@mui/material'
import React, { useState, useRef }  from 'react'
import _uniqueId from 'lodash/uniqueId';
import { DateTime } from 'luxon'

/**
 * Scroll to an element after a 250ms delay.
 *
 * Accepts either an element or a an arrow function that returns a NodeList of
 * Elements, which allows us to delay the query for the elements to scroll to
 * and filter out zero-height elements.
 *
 * ```
 * scrollToElement(document.querySelector(`${expanderId}:first-child`))
 * scrollToElement(() => document.querySelectorAll('.Mui-error'))
 * ```
 */
type ElementOrFunction = Element | (() => NodeListOf<Element>);
export function scrollToElement(elem: ElementOrFunction){
    setTimeout(() => {
        let openedSection: Element; // the element to scroll to
        if (elem instanceof Element) {
            openedSection = elem;
        } else {
            // NodeList could contain a bunch of hidden element with height 0,
            // so we're filtering those out
            let nonzero_elems = Array.from(elem()).filter((e) => {
                const box = e.getBoundingClientRect();
                return (box.bottom - box.top) > 0;
            })
            if (nonzero_elems.length === 0) return;
            openedSection = nonzero_elems[0];
        }

        const navBox = document.querySelector('header').getBoundingClientRect();
        const navHeight = navBox.bottom - navBox.top;

        const elemTop = document.documentElement.scrollTop + openedSection.getBoundingClientRect().top - 30;
        const elemBottom = elemTop + openedSection.scrollHeight;
        const windowTop = document.documentElement.scrollTop;
        const windowBottom = windowTop + window.innerHeight;

        if(elemTop < windowTop || elemBottom > windowBottom){
            window.scrollTo({
                top: elemTop - navHeight,
                behavior: 'smooth'   
            });
        }
    }, 250);
}

export const DetailExpander = ({children, title}) => {
    const [viewDetails, setViewDetails] = useState(false);
    const expanderId = _uniqueId('detailExpander-')

    return <>
        <div className={`detailExpander ${expanderId}`} style={{display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center', cursor: 'pointer', alignItems: 'center'}} onClick={() => {
            if(!viewDetails){
                scrollToElement(document.querySelector(`${expanderId}:first-child`))
            }
            setViewDetails(!viewDetails)
        }}>
            <Typography variant='h6'>{title}</Typography>
            {!viewDetails && <ExpandMore />}
            {viewDetails && <ExpandLess />}
        </div>
        {viewDetails && children}
    </>
}

export const DetailExpanderGroup = ({children, defaultSelectedIndex}) => {
    const [widgetIndex, setWidgetIndex] = useState(defaultSelectedIndex);

    const groupRef = useRef(null);

    if(!Array.isArray(children) || children.length <= 1) return <>{children}</>;

    return <div ref={groupRef} className='detailExpanderGroup'>
        {children.map((child,i) => (
            <Paper
                elevation={5}
                sx={{backgroundColor: 'brand.white', padding: '8px', width: '100%'}} >
                <div
                    className='detailSection'
                    style={{display: 'flex', flexDirection: 'row', justifyContent: 'flexStart', cursor: 'pointer'}}
                    onClick={() => {
                        if((widgetIndex != i)){
                            scrollToElement(groupRef.current.querySelectorAll(`.detailSection`)[i].parentNode);
                        }
                        setWidgetIndex((widgetIndex == i)? -1 : i);
                    }}
                >
                    <Typography variant='h6'>{child.props.title}</Typography>
                    <IconButton>
                        {(widgetIndex != i) && <ExpandMore />}
                        {(widgetIndex == i) && <ExpandLess />}
                    </IconButton>
                </div>
                {(widgetIndex == i) && 
                    <>
                        <hr/>
                        <div style={{textAlign: 'left'}}>
                            {child}
                        </div>
                    </>
                }
            </Paper>
        ))}
    </div>;
}

export const formatDate = (time, displayTimezone=null) => {
    if(displayTimezone === null) displayTimezone = DateTime.now().zone.name;

    return DateTime.fromJSDate(new Date(time))
        .setZone(displayTimezone)
        .toLocaleString(DateTime.DATETIME_FULL)
}

export const isValidDate = (d) => {
    if (d instanceof Date) return !isNaN(d.valueOf())
    if (typeof (d) === 'string') return !isNaN(new Date(d).valueOf())
    return false
}
