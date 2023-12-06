echo "aws s3 cp./public/"
echo "s3://jaf-unwrapped.site/ --recursive"
echo "aws cloudfront create-invalidation"
echo "distribution-id EPRLI4PQUKWBM"
echo "--paths /*"
echo ""
echo "------"
echo ""
aws s3 cp ./public/ \
s3://jaf-unwrapped.site/ \
--recursive \
--profile joe
aws cloudfront create-invalidation \
--distribution-id EPRLI4PQUKWBM \
--paths "/*" \
--profile joe \