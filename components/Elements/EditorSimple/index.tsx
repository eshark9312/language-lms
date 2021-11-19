import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(() => import('./Editor'), {
	ssr: false
});

const EditorSimple = (props) => {
	const { handleChange, isReset, questionContent, isTranslate } = props;

	return (
		<div className="summernote-style">
			<DynamicComponentWithNoSSR
				getDataEditor={(value) => handleChange(value)} // Get content with string type
				isReset={isReset}
				questionContent={questionContent}
				isTranslate={isTranslate}
			/>
		</div>
	);
};

export default EditorSimple;
