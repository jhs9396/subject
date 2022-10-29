import React from 'react';
import { ContentType } from 'types/components/widget/detail-info';
import { uniqueId } from 'lodash';

interface IDetailInfo {
  isOpen: boolean;
  contents: ContentType[];
}

function DetailInfo(props: IDetailInfo) {
  const { isOpen, contents } = props;

  return (
    <div className={isOpen ? 'detail-info on' : 'detail-info off'}>
      {contents.length > 0 &&
        contents.map((content: ContentType) => (
          <div key={uniqueId()}>
            <span>{content.title}</span>
            <li className="separator" />
            <content.component />
          </div>
        ))}
    </div>
  );
}

export default DetailInfo as React.FunctionComponent<IDetailInfo>;
