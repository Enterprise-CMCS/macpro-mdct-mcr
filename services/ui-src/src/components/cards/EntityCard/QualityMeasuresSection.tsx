const TopQualityMeasuresSection = () => <p>TBD</p>;

const BottomQualityMeasuresSection = () => <p>TBD</p>;

export const QualityMeasuresSection = ({
  topSection,
  bottomSection,
}: Props) => (
  <>
    {topSection && <TopQualityMeasuresSection />}
    {bottomSection && <BottomQualityMeasuresSection />}
  </>
);

interface Props {
  topSection?: boolean;
  bottomSection?: boolean;
}
