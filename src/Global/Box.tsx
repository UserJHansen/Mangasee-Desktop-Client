import React from 'react';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CSS from './box.module.scss';

interface BoxProps {
  children: React.ReactNode;
  width: number;
  icon: IconDefinition;
  title: string;
  className?: string;
  style?: Record<string, unknown>;
  rightIcon?: IconDefinition;
  rightText?: string;
  LinkElement?: React.ElementType;
  linkProps?: Record<string, unknown>;
}

export default function Box({
  children,
  className,
  width,
  icon,
  title,
  style = {},
  rightIcon = undefined,
  rightText = '',
  LinkElement = undefined,
  linkProps = {},
}: BoxProps) {
  const content = (
    <div
      className={className}
      style={{ marginTop: '15px', marginBottom: '15px' }}
    >
      <div className={CSS.header}>
        <FontAwesomeIcon icon={icon} />
        {` ${title}`}
        {rightIcon && LinkElement ? (
          <LinkElement
            className={CSS.link}
            {...{ to: linkProps.to, onClick: linkProps.onClick }}
          >
            {`${rightText || ''} `}
            <FontAwesomeIcon icon={rightIcon} />
          </LinkElement>
        ) : (
          <></>
        )}
      </div>
      <div style={style} className={CSS.body}>
        {children}
      </div>
    </div>
  );

  return width > 0 ? <Col xs={width}>{content}</Col> : content;
}

Box.defaultProps = {
  rightIcon: undefined,
  rightText: undefined,
  style: {},
  LinkElement: undefined,
  linkProps: {},
  className: '',
};
