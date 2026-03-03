function TypePuck({ size = 50, typeObject, hover = true, textClass = '' } = {}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${typeObject?.tw} font-normal ${textClass}`}
      style={{ width: size, height: size }}
      title={typeObject?.permit_subtype ? typeObject.permit_subtype : 'Permit subtype not found'}
    >
      {typeObject?.short}
    </div>
  );
}

export default TypePuck;
